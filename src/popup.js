import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import styled from "styled-components";
import pLimit from "p-limit";
import axiosRetry from "axios-retry";

import {
  copyToClipboard,
  extractWhatsappLinks,
  fetchData,
  handleError,
  inviteLink,
  isGoogle,
  parseUrl,
} from "./utils";
import Header from "./components/Header";
import Actions from "./components/Actions";
import Links from "./components/Links";
import Logs from "./components/Logs";
import { GOOGLE_SEARCH_URL } from "./constants";
import googleAnalytics from "../scripts/google-analytics";

const Container = styled.div`
  max-width: 800px;
  min-height: calc(100vh - 60px);
  min-width: 500px;
  padding: 12px;
  padding-top: 0px;
  position: relative;
`;

const ExtractButton = styled.button`
  &::after {
    border-color: #000;
    border-top-color: transparent;
    border-right-color: transparent;
  }
`;

// Configure Axios to retry failed requests
// axiosRetry(axios, {
//   retries: 3, // Retry failed requests up to 3 times
//   retryDelay: axiosRetry.exponentialDelay, // Exponential backoff
//   retryCondition: (error) =>
//     error.response?.status === 429 ||
//     axiosRetry.isNetworkOrIdempotentRequestError(error),
// });

function Popup() {
  const [currentURL, setCurrentURL] = useState();
  const [googleSearchLinks, setGoogleSearchLinks] = useState([]);
  const [hasCopyAsJSON, setHasCopyAsJSON] = useState(false);
  const [isCopyAsJSON, setIsCopyAsJSON] = useState(false);
  const [hasCopyAsText, setHasCopyAsText] = useState(false);
  const [isCopyAsText, setIsCopyAsText] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [otherLinks, setOtherLinks] = useState([]);

  const isGoogleSearchPage = isGoogle(currentURL);

  const searchLinks = useMemo(
    () => googleSearchLinks.filter((val) => !val.includes(GOOGLE_SEARCH_URL)),
    [googleSearchLinks],
  );

  const getAllAnchorTags = () => {
    const isGoogleSearch =
      `${window?.location?.origin}${window?.location?.pathname}` ===
      "https://www.google.com/search";

    let tags = document.getElementsByTagName("a");
    if (isGoogleSearch) {
      tags = document.querySelectorAll("#search a");
    }
    const ls = [];
    for (let idx = 0; idx < tags.length; idx += 1) {
      const value = tags[idx];
      const res = value.href.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g,
      );
      if (res !== null) {
        ls.push(value.href);
      }
    }
    return Array.from(new Set(ls));
  };

  useEffect(() => {
    chrome.tabs.query(
      { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
      (tabs) => {
        const { url, id } = tabs[0];
        setCurrentURL(url);
        chrome.scripting.executeScript(
          {
            target: { tabId: id },
            func: getAllAnchorTags,
          },
          (injectionResults) => {
            let linksFrom = [];
            injectionResults?.forEach(({ result }) => {
              linksFrom = [...linksFrom, ...result];
            });

            googleAnalytics.fireEvent("search", { q: "test" });

            if (!isGoogle(url)) {
              const whatsappLink = linksFrom
                .map((val) => inviteLink(val))
                .filter((val) => val);
              if (whatsappLink.length > 0) {
                setLinks([...new Set(whatsappLink)]);
              } else {
                setOtherLinks([...new Set(linksFrom)]);
              }
            } else {
              setGoogleSearchLinks([...new Set(linksFrom)]);
            }
          },
        );
      },
    );
  }, []);

  const logResults = (log, waLinks) => {
    setLogs((prevState) => [
      ...prevState,
      {
        ...log,
        count: waLinks.length,
      },
    ]);
  };

  const getWhatsappLink = async (val) => {
    const waLinks = [];
    const tmpLog = {
      count: 0,
      errorMessage: null,
      hasError: false,
      ...parseUrl(val),
    };

    try {
      const { data } = await fetchData(val);
      const extractedLinks = extractWhatsappLinks(data);
      waLinks.push(...extractedLinks);
    } catch (error) {
      Object.assign(tmpLog, handleError(error.message));
    }
    logResults(tmpLog, waLinks);
    return waLinks;
  };

  const fetchAll = async () => {
    const limit = pLimit(50); // Allow up to 50 concurrent requests
    setHasCopyAsJSON(false);
    setHasCopyAsText(false);
    setLinks([]);
    setLoading(true);
    setLogs([]);
    let store = [];

    const promises = searchLinks.map((link) =>
      limit(() => getWhatsappLink(link)),
    );

    try {
      const res = await Promise.allSettled(promises);

      res.forEach((r) => {
        if (r.status === "fulfilled" && r.value) {
          store = [...store, ...r.value];
        }
      });
      const uniqueLinks = [...new Set(store)];
      setLinks(uniqueLinks);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (format) => {
    const isTextFormat = format === "text";

    setHasCopyAsJSON(false);
    setHasCopyAsText(false);

    if (isTextFormat) {
      setIsCopyAsText(true);
    } else {
      setIsCopyAsJSON(true);
    }

    try {
      const content = isTextFormat ? links.join("\r\n") : JSON.stringify(links);
      await copyToClipboard(content);

      if (isTextFormat) {
        setIsCopyAsText(false);
        setHasCopyAsText(true);
      } else {
        setIsCopyAsJSON(false);
        setHasCopyAsJSON(true);
      }
    } catch (error) {
      if (isTextFormat) {
        setIsCopyAsText(false);
        setHasCopyAsText(false);
      } else {
        setIsCopyAsJSON(false);
        setHasCopyAsJSON(false);
      }
    }
  };

  return (
    <>
      <Header />
      <Container
        style={{
          ...(links.length === 0 &&
            logs.length === 0 && {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }),
        }}
      >
        {links.length > 0 && (
          <>
            <Actions
              links={links}
              isLoading={isLoading}
              hasCopyAsJSON={hasCopyAsJSON}
              hasCopyAsText={hasCopyAsText}
              isCopyAsJSON={isCopyAsJSON}
              isCopyAsText={isCopyAsText}
              isGoogleSearchPage={isGoogleSearchPage}
              onCopy={handleCopy}
              onFetch={fetchAll}
            />
            <Links links={links} />
          </>
        )}
        {!isGoogleSearchPage && links.length < 1 && (
          <p className="text-centre">{`There is no WhatsApp group link on this page but you found ${otherLinks.length} other links.`}</p>
        )}
        {isGoogleSearchPage && links.length < 1 && (
          <>
            <p className="text-centre">
              Extract WhatsApp group links from Google search result (
              {searchLinks.length})
            </p>
            <div className="text-center">
              <ExtractButton
                className={`shape-rounded bg-yellow shadow-hard ${isLoading && "with-loader"}`}
                type="button"
                onClick={fetchAll}
                disabled={isLoading}
              >
                Extract {logs.length > 0 && links.length === 0 ? "again" : null}
              </ExtractButton>
            </div>
          </>
        )}

        {isGoogleSearchPage && links.length === 0 && logs.length > 0 && (
          <Logs logs={logs} />
        )}
      </Container>
    </>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
