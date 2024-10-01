import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

function Logs({ logs }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <table className="ff-table bordered-rows full-width striped padding-tiny">
      <tbody>
        {logs.map((log, index) => (
          <tr key={log.href} className="font-mono text-small">
            <td>{index + 1}</td>
            <td>
              <a target="_blank" href={log?.href} rel="noreferrer">
                {log?.origin}
              </a>
            </td>
            <td style={{ color: log?.hasError ? "red" : "inherit" }}>
              {log?.count > 0 && <p>{`finds ${log?.count} links`}</p>}
              {log?.errorMessage && <span>{log?.errorMessage}</span>}
            </td>
          </tr>
        ))}
        <tr ref={bottomRef} />
      </tbody>
    </table>
  );
}

Logs.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      origin: PropTypes.string,
      href: PropTypes.string,
      count: PropTypes.number,
      errorMessage: PropTypes.string,
      hasError: PropTypes.bool,
    }),
  ).isRequired,
};

export default Logs;
