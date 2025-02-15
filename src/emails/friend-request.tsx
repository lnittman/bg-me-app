import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { fonts } from '@/app/fonts';

interface FriendRequestEmailProps {
  senderName: string;
  senderEmail: string;
  recipientName: string;
  acceptUrl: string;
}

export default function FriendRequestEmail({
  senderName,
  senderEmail,
  recipientName,
  acceptUrl,
}: FriendRequestEmailProps) {
  return (
    <Html>
      <Head>
        <style>
          {`
            @font-face {
              font-family: 'IosevkaTerm';
              src: url('https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/6397be61-3ea4-459d-8a3e-fd95168cb214.woff2') format('woff2');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
          `}
        </style>
      </Head>
      <Preview>New friend request from {senderName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Friend Request</Heading>
          <Text style={text}>
            Hi {recipientName},
          </Text>
          <Text style={text}>
            {senderName} ({senderEmail}) would like to add you as a friend on bg.me.
          </Text>
          <Section style={buttonContainer}>
            <Button
              pX={20}
              pY={12}
              style={button}
              href={acceptUrl}
            >
              Accept Friend Request
            </Button>
          </Section>
          <Text style={text}>
            Or copy and paste this URL into your browser:{' '}
            <Link
              href={acceptUrl}
              target="_blank"
              style={link}
            >
              {acceptUrl}
            </Link>
          </Text>
          <Text style={footer}>
            This email was sent from bg.me. If you'd rather not receive these emails,
            you can manage your notification settings in your account preferences.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#09090b',
  fontFamily: 'IosevkaTerm',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
  backgroundColor: '#1f1f23',
  borderRadius: '12px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  textAlign: 'center' as const,
  margin: '30px 0',
  padding: '0',
  lineHeight: '1',
};

const text = {
  color: '#e2e2e4',
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  margin: '0 0 16px',
  padding: '0 48px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  width: 'auto',
  padding: '12px 24px',
};

const link = {
  color: '#4f46e5',
  textDecoration: 'underline',
};

const footer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'left' as const,
  margin: '48px 0 0',
  padding: '0 48px',
}; 