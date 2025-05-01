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

interface RejectionEmailProps {
  storeName: string;
  userName: string;
  reason?: string;
}

export const RejectionEmail: React.FC<RejectionEmailProps> = ({
  storeName,
  userName,
  reason = "Your application did not meet our current marketplace requirements.",
}) => {
  return (
    <Html>
      <Head />
      <Preview>Update Regarding Your Store Application - BestWareHub</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Row>
              <Column>
                <Heading style={h1}>BestWareHub</Heading>
              </Column>
            </Row>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Store Application Update</Heading>
            <Text style={paragraph}>
              Hello {userName},
            </Text>
            <Text style={paragraph}>
              Thank you for your interest in becoming a vendor on the BestWareHub marketplace. We have carefully reviewed your store application for <strong>{storeName}</strong>.
            </Text>
            <Text style={paragraph}>
              After thorough consideration, we regret to inform you that we are unable to approve your store application at this time.
            </Text>

            <Section style={reasonContainer}>
              <Text style={reasonTitle}>Reason for Decision:</Text>
              <Text style={reasonText}>{reason}</Text>
            </Section>

            <Text style={paragraph}>
              We encourage you to address the issues mentioned above and submit a new application in the future. Our team is committed to maintaining high standards for our marketplace to ensure the best experience for both vendors and customers.
            </Text>

            <Section style={nextStepsContainer}>
              <Heading style={h3}>What's Next?</Heading>
              <Row>
                <Column style={stepColumn}>
                  <Img 
                    src="https://img.freepik.com/premium-photo/parcel-paper-cartons-with-shopping-cart-logo-trolley-laptop-keyboard_9635-3540.jpg?uid=R146437641&ga=GA1.1.123314603.1706863307&semt=ais_hybrid" 
                    width="48" 
                    height="48" 
                    alt="Review guidelines icon" 
                    style={stepIcon}
                  />
                  <Text style={stepTitle}>Review Our Guidelines</Text>
                  <Text style={stepText}>Learn more about our vendor requirements</Text>
                </Column>
                <Column style={stepColumn}>
                  <Img 
                    src="https://img.freepik.com/free-photo/young-man-using-discount-coupon-his-smartphone-some-online-shopping-laptop_662251-2177.jpg?uid=R146437641&ga=GA1.1.123314603.1706863307&semt=ais_hybrid" 
                    width="48" 
                    height="48" 
                    alt="Improve application icon" 
                    style={stepIcon}
                  />
                  <Text style={stepTitle}>Improve Your Application</Text>
                  <Text style={stepText}>Address the feedback provided</Text>
                </Column>
                <Column style={stepColumn}>
                  <Img 
                    src="https://img.freepik.com/premium-photo/young-african-business-owner-woman-prepare-parcel-box-standing-check-online-orders-deliver-customer-tablet-laptop-shopping-online-concept-office_1300982-6458.jpg?uid=R146437641&ga=GA1.1.123314603.1706863307&semt=ais_hybrid" 
                    width="48" 
                    height="48" 
                    alt="Reapply icon" 
                    style={stepIcon}
                  />
                  <Text style={stepTitle}>Reapply</Text>
                  <Text style={stepText}>Submit a new application in 30 days</Text>
                </Column>
              </Row>
            </Section>

            <Section style={buttonContainer}>
              <Button
              
                style={button}
                href="https://img.freepik.com/free-vector/ecommerce-campaign-concept-illustration_114360-8432.jpg?uid=R146437641&ga=GA1.1.123314603.1706863307&semt=ais_hybrid"
              >
                View Vendor Guidelines
              </Button>
            </Section>

            <Text style={paragraph}>
              If you have any questions or would like further clarification, please contact our vendor support team at <a href="mailto:vendor-support@bestwarehub.com" style={linkStyle}>vendor-support@bestwarehub.com</a>.
            </Text>

            <Text style={signatureText}>
              Best regards,<br />
              The BestWareHub Vendor Relations Team
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} BestWareHub. All rights reserved.
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
  backgroundColor: "#475569",
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

const content = {
  padding: "32px",
};

const h2 = {
  color: "#1F2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const h3 = {
  color: "#1F2937",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 16px",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#4B5563",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const reasonContainer = {
  backgroundColor: "#F9FAFB",
  borderRadius: "6px",
  padding: "16px",
  margin: "24px 0",
  border: "1px solid #E5E7EB",
};

const reasonTitle = {
  color: "#1F2937",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 8px",
};

const reasonText = {
  color: "#4B5563",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0",
};

const nextStepsContainer = {
  margin: "32px 0",
};

const stepColumn = {
  padding: "0 8px",
  textAlign: "center" as const,
};

const stepIcon = {
  margin: "0 auto 12px",
  display: "block",
};

const stepTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1F2937",
  margin: "8px 0",
};

const stepText = {
  fontSize: "14px",
  color: "#6B7280",
  margin: "4px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#475569",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const linkStyle = {
  color: "#3B82F6",
  textDecoration: "none",
};

const signatureText = {
  color: "#4B5563",
  fontSize: "16px",
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

export default RejectionEmail;