import PropTypes from "prop-types";
import React from "react";

function Links({ links }) {
  return (
    <table className="ff-table bordered-rows full-width striped padding-tiny">
      <tbody>
        {links.map((link, index) => (
          <tr key={link}>
            <td>{index + 1}</td>
            <td>
              <a
                className="font-mono text-small"
                target="_blank"
                href={link}
                rel="noreferrer"
              >
                {link}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Links.propTypes = {
  links: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Links;
