import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Button,
  Hr,
} from "@react-email/components";

interface VerificationEmailProps {
  code: string;
  name: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  code,
  name,
}) => {
  const codeArray = code.split("");

  return (
    <Html>
      <Head />
      <Preview>Verify your email address for Kartify</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Heading style={h1}>Kartify</Heading>
          </Section>
          <Section style={content}>
            <Heading style={h2}>Verify your email address</Heading>
            <Text style={paragraph}>
              Hi {name},
            </Text>
            <Text style={paragraph}>
              Thank you for signing up for Kartify. To complete your registration, please enter the verification code below:
            </Text>

            <Row style={codeContainer}>
              {codeArray.map((digit, index) => (
                <Column key={index} style={codeColumn}>
                  <Text style={codeText}>{digit}</Text>
                </Column>
              ))}
            </Row>

            <Text style={paragraph}>
              This code will expire in 30 minutes. If you didn't request this verification, you can safely ignore this email.
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              &copy; {new Date().getFullYear()} Kartify. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
};

const logoContainer = {
  padding: "20px",
  borderBottom: "1px solid #eaeaea",
};

const h1 = {
  color: "#F59E0B",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "center" as const,
};

const h2 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 15px",
};

const content = {
  padding: "20px",
};

const paragraph = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "16px 0",
};

const codeContainer = {
  margin: "30px auto",
  textAlign: "center" as const,
};

const codeColumn = {
  display: "inline-block",
  margin: "0 4px",
};

const codeText = {
  backgroundColor: "#F59E0B",
  border: "1px solid #F59E0B",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "12px 18px",
  textAlign: "center" as const,
};

const hr = {
  borderTop: "1px solid #eaeaea",
  margin: "30px 0",
};

const footer = {
  color: "#666",
  fontSize: "12px",
  textAlign: "center" as const,
};

export default VerificationEmail;