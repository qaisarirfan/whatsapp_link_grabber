import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const ActionsContainer = styled.div`
  align-items: center;
  background: #fff;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  left: 12px;
  padding-bottom: 12px;
  padding-top: 12px;
  position: sticky;
  right: 12px;
  top: 0;
`;

function Actions({
  hasCopyAsJSON,
  hasCopyAsText,
  isCopyAsJSON,
  isCopyAsText,
  isGoogleSearchPage,
  isLoading,
  links,
  onCopy,
  onFetch,
}) {
  const buttonClasses = [
    "size-small",
    "shadow-hard",
    "bg-blue",
    "text-white",
    "with-loader",
  ];
  let copyAsTextButton = [...buttonClasses];
  if (!isCopyAsText) {
    copyAsTextButton = copyAsTextButton.filter((val) => val !== "with-loader");
  }
  if (hasCopyAsText) {
    copyAsTextButton = copyAsTextButton.filter((val) => val !== "bg-blue");
    copyAsTextButton.push("bg-green");
  }

  let copyAsJSONButton = [...buttonClasses];
  if (!isCopyAsJSON) {
    copyAsJSONButton = copyAsJSONButton.filter((val) => val !== "with-loader");
  }
  if (hasCopyAsJSON) {
    copyAsJSONButton = copyAsJSONButton.filter((val) => val !== "bg-blue");
    copyAsJSONButton.push("bg-green");
  }
  return (
    <ActionsContainer>
      <div>{links.length > 0 && <p>{`Total: ${links.length}`}</p>}</div>
      <div>
        {isGoogleSearchPage && links.length > 0 && (
          <button
            className={`size-small bg-yellow shadow-hard ${isLoading && "with-loader"}`}
            type="button"
            onClick={onFetch}
            disabled={isLoading}
          >
            Extract again
          </button>
        )}
        <button
          className={copyAsTextButton.join(" ")}
          type="button"
          onClick={() => onCopy("text")}
          disabled={links.length < 1}
        >
          {`${hasCopyAsText ? "Copied" : "Copy"} as Text`}
        </button>
        <button
          className={copyAsJSONButton.join(" ")}
          type="button"
          onClick={() => onCopy("json")}
          disabled={links.length < 1}
        >
          {`${hasCopyAsJSON ? "Copied" : "Copy"} as JSON`}
        </button>
      </div>
    </ActionsContainer>
  );
}

Actions.propTypes = {
  hasCopyAsJSON: PropTypes.bool.isRequired,
  hasCopyAsText: PropTypes.bool.isRequired,
  isCopyAsJSON: PropTypes.bool.isRequired,
  isCopyAsText: PropTypes.bool.isRequired,
  isGoogleSearchPage: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  links: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCopy: PropTypes.func.isRequired,
  onFetch: PropTypes.func.isRequired,
};

export default Actions;
