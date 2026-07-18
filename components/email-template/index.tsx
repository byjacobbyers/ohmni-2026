import * as React from 'react'
import type { EmailTemplateProps } from '@/types/components/email-template-type'
import { brand } from '@/lib/brand'

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  formLabel = 'Contact Form',
}) => (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    }}
  >
    <h1
      style={{
        color: '#333',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
      }}
    >
      New {formLabel} Submission
    </h1>

    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <p style={{ margin: '5px 0' }}>
        <strong>Name:</strong> {name}
      </p>
      <p style={{ margin: '5px 0' }}>
        <strong>Email:</strong> {email}
      </p>
    </div>

    <div
      style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #eee',
        fontSize: '12px',
        color: '#666',
      }}
    >
      <p>This message was sent from the {brand.name} website.</p>
      <p>Timestamp: {new Date().toLocaleString()}</p>
    </div>
  </div>
)
