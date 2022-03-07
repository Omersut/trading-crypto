import { BsGithub } from "react-icons/bs";
import { AiFillLinkedin } from "react-icons/ai";
import React from "react";

function Footer() {
  return (
    <div>
      <p
        style={{
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        Developed by{" "}
        <a
          style={{
            textDecoration: "none",
            color: "rgb(50,50,50)",
            fontSize: "20px",
          }}
          href="https://www.linkedin.com/in/tayfundagci/"
          target="blank"
        >
          /omerSut
        </a>
        <br />
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-14px",
        }}
      >
        <a href="https://www.github.com/tayfundagci/" target="blank">
          <BsGithub size={"33"} style={{ color: "rgb(50,50,50)" }} />
        </a>
        <a
          className="ms-2"
          href="https://www.linkedin.com/in/tayfundagci/"
          target="blank"
        >
          <AiFillLinkedin size={"40"} style={{ color: "rgb(50,50,50)" }} />
        </a>
      </div>
    </div>
  );
}

export default Footer;
