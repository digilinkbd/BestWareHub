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
  Img,
} from "@react-email/components";

interface ApprovalEmailProps {
  storeName: string;
  userName: string;
  approvalUrl: string;
}

export const ApprovalEmail: React.FC<ApprovalEmailProps> = ({
  storeName,
  userName,
  approvalUrl,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Your Store Application Has Been Approved! - Kartify</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Row>
              <Column>
                <Heading style={h1}>Kartify</Heading>
              </Column>
            </Row>
          </Section>

          <Section style={heroSection}>
            <Img
              src="https://via.placeholder.com/600x200"
              alt="Congratulations on your store approval"
              width="600"
              height="200"
              style={heroImage}
            />
          </Section>

          <Section style={content}>
            <Heading style={h2}>Congratulations, {userName}!</Heading>
            <Text style={paragraph}>
              We're thrilled to inform you that your store <strong>{storeName}</strong> has been 
              approved and is ready to join the Kartify marketplace.
            </Text>

            <Section style={featuresContainer}>
              <Row>
                <Column style={featureColumn}>
                  <Img 
                    src="https://img.freepik.com/free-photo/showing-cart-trolley-shopping-online-sign-graphic_53876-133967.jpg?uid=R146437641&ga=GA1.1.123314603.1706863307&semt=ais_hybrid" 
                    width="64" 
                    height="64" 
                    alt="Global reach icon" 
                    style={featureIcon}
                  />
                  <Text style={featureTitle}>Global Reach</Text>
                  <Text style={featureText}>Access customers worldwide through our platform</Text>
                </Column>
                <Column style={featureColumn}>
                  <Img 
                    src="https://img.freepik.com/free-photo/glad-online-merchant-focused-smartphone-device-stands-against-yellow-clothing-racks_273609-32924.jpg?uid=R146437641&ga=GA1.1.123314603.1706863307&semt=ais_hybrid" 
                    width="64" 
                    height="64" 
                    alt="Secure payments icon" 
                    style={featureIcon}
                  />
                  <Text style={featureTitle}>Secure Payments</Text>
                  <Text style={featureText}>Reliable payment processing and payouts</Text>
                </Column>
                <Column style={featureColumn}>
                  <Img 
                    src="https://img.freepik.com/premium-photo/young-african-woman-running-online-store-startup-small-business-sme-using-smartphone-tablet-taking-receive-checking-online-purchase-shopping-order-office_1090013-5620.jpg?uid=R146437641&ga=GA1.1.123314603.1706863307&semt=ais_hybrid" 
                    width="64" 
                    height="64" 
                    alt="Analytics icon" 
                    style={featureIcon}
                  />
                  <Text style={featureTitle}>Analytics</Text>
                  <Text style={featureText}>Detailed insights to grow your business</Text>
                </Column>
              </Row>
            </Section>

            <Text style={paragraph}>
              To complete your store setup and start selling, please click the button below:
            </Text>

            <Section style={buttonContainer}>
              <Button
                style={button}
                href={approvalUrl}
              >
                Complete Store Setup
              </Button>
            </Section>

            <Text style={paragraph}>
              This link will expire in 24 hours. If you have any questions or need assistance, 
              our vendor support team is available to help you every step of the way.
            </Text>

            <Text style={paragraph}>
              Welcome to the Kartify family!
            </Text>

            <Text style={signatureText}>
              The Kartify Team
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Kartify. All rights reserved.
            </Text>
            <Text style={footerText}>
              123 E-Commerce Street, Digital City, 98765
            </Text>
            <Text style={footerLinks}>
              <a href="#" style={footerLink}>Privacy Policy</a> • 
              <a href="#" style={footerLink}>Terms of Service</a> • 
              <a href="#" style={footerLink}>Unsubscribe</a>
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
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  borderRadius: "8px",
  overflow: "hidden",
  maxWidth: "600px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
};

const logoContainer = {
  backgroundColor: "#fcba03",
  padding: "24px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "1px",
};

const heroSection = {
  backgroundColor: "#3B82F6",
  padding: "0",
};

const heroImage = {
  display: "block",
  width: "100%",
};

const content = {
  padding: "32px",
};

const h2 = {
  color: "#1F2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#4B5563",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const featuresContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const featureColumn = {
  padding: "0 8px",
};

const featureIcon = {
  margin: "0 auto 12px",
  display: "block",
};

const featureTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: "8px 0",
};

const featureText = {
  fontSize: "14px",
  color: "#6B7280",
  margin: "4px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#fcba03",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  boxShadow: "0 4px 6px rgba(59, 130, 246, 0.25)",
};

const signatureText = {
  color: "#4B5563",
  fontSize: "16px",
  fontStyle: "italic",
  margin: "32px 0 0",
};

const hr = {
  borderTop: "1px solid #E5E7EB",
  margin: "0",
};

const footer = {
  padding: "24px 32px",
  backgroundColor: "#F9FAFB",
};

const footerText = {
  color: "#6B7280",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "4px 0",
  textAlign: "center" as const,
};

const footerLinks = {
  color: "#6B7280",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "16px 0 4px",
  textAlign: "center" as const,
};

const footerLink = {
  color: "#3B82F6",
  textDecoration: "none",
  padding: "0 6px",
};

export default ApprovalEmail;