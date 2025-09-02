// import React from 'react';

// const Email = ({
//     ticket_id = "12345",
//     issue_summary = "Login issues with the application",
//     sla_target = "24 hours",
//     elapsed_time = "36 hours",
//     reason_for_breach = "Higher than usual ticket volume and technical complexity"
// }) => {
//     return (
//         <div>
//             {/* Email wrapper table */}
//             <table
//                 align="center"
//                 border="0"
//                 cellPadding="0"
//                 cellSpacing="0"
//                 width="100%"
//                 style={{
//                     borderCollapse: 'collapse',
//                     fontFamily: 'Outfit, Arial, sans-serif',
//                     fontSize: '16px',
//                     fontWeight: '600',
//                     lineHeight: '1.5',
//                     margin: '0',
//                     padding: '0',
//                     color: '#2D004C',
//                     backgroundColor: '#f5f5f5'
//                 }}
//             >
//                 <tr>
//                     <td align="center" style={{ padding: '20px 0' }}>
//                         {/* Header outside the bordered content */}
//                         <table
//                             border="0"
//                             cellPadding="0"
//                             cellSpacing="0"
//                             width="96%"
//                             style={{ borderCollapse: 'collapse',marginBottom:'20px' }}
//                         >
//                             <tr>
//                                 <td
//                                     align="center"
//                                     style={{
//                                         padding: '20px',
//                                         backgroundColor: '#e74c3c',
//                                         color: '#ffffff',
//                                         fontSize: '18px',
//                                         fontWeight: '600',
//                                         lineHeight: '29px',
//                                         fontFamily: 'Outfit, Arial, sans-serif'
//                                     }}
//                                 >
//                                     SLA Breach Notification
//                                 </td>
//                             </tr>
//                         </table>

//                         {/* Main content with border and 8px border-radius */}
//                         <table
//                             border="0"
//                             cellPadding="0"
//                             cellSpacing="0"
//                             width="90%"
//                             style={{
//                                 borderCollapse: 'collapse',
//                                 backgroundColor: '#ffffff',
//                                 border: '1px solid #D4D4D4',
//                                 borderRadius: '8px',
//                                 fontFamily: 'Outfit, Arial, sans-serif'
//                             }}
//                         >
//                             {/* Greeting */}
//                             <tr>
//                                 <td style={{ padding: '20px' }}>
//                                     <p style={{ margin: '0 0 12px 0' }}>
//                                         Hello <span style={{ color: '#9500FF', fontSize: '18px', fontWeight: '600', lineHeight: '29px' }}>Aaryan</span>,
//                                     </p>
//                                     <p style={{ margin: '0 0 12px 0' }}>
//                                         We regret to inform you that your support ticket #{ticket_id} has
//                                         exceeded the agreed Service Level Agreement (SLA) resolution time.
//                                     </p>
//                                 </td>
//                             </tr>

//                             {/* Ticket details */}
//                             <tr>
//                                 <td style={{ padding: '10px 20px' }}>
//                                     <table border="0" cellPadding="0" cellSpacing="0" width="100%">
//                                         <tr>
//                                             <td width="20" valign="top" style={{ padding: '8px 8px 8px 0' }}>•</td>
//                                             <td width="30%" style={{ padding: '8px', fontWeight: '600' }}>Ticket ID:</td>
//                                             <td width="70%" style={{ padding: '8px' }}>{ticket_id}</td>
//                                         </tr>
//                                         <tr>
//                                             <td width="20" valign="top" style={{ padding: '8px 8px 8px 0' }}>•</td>
//                                             <td style={{ padding: '8px', fontWeight: '600' }}>Issue Reported:</td>
//                                             <td style={{ padding: '8px' }}>{issue_summary}</td>
//                                         </tr>
//                                         <tr>
//                                             <td width="20" valign="top" style={{ padding: '8px 8px 8px 0' }}>•</td>
//                                             <td style={{ padding: '8px', fontWeight: '600' }}>SLA Target:</td>
//                                             <td style={{ padding: '8px' }}>{sla_target}</td>
//                                         </tr>
//                                         <tr>
//                                             <td width="20" valign="top" style={{ padding: '8px 8px 8px 0' }}>•</td>
//                                             <td style={{ padding: '8px', fontWeight: '600' }}>Elapsed Time:</td>
//                                             <td style={{ padding: '8px' }}>{elapsed_time}</td>
//                                         </tr>
//                                     </table>
//                                 </td>
//                             </tr>

//                             {/* Reason for breach */}
//                             <tr>
//                                 <td style={{ padding: '15px 20px 5px 20px' }}>
//                                     <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Reason for SLA Breach:</p>
//                                     <p style={{
//                                         margin: '0 0 12px 0',
//                                         // padding: '10px',
//                                         // backgroundColor: '#fff4f4',
//                                         // borderLeft: '3px solid #e74c3c'
//                                     }}>
//                                         {reason_for_breach}
//                                     </p>
//                                 </td>
//                             </tr>

//                             {/* Apology */}
//                             <tr>
//                                 <td style={{ padding: '10px 20px' }}>
//                                     <p style={{ margin: '0 0 12px 0' }}>
//                                         We understand the importance of timely support and sincerely apologize
//                                         for this delay. Our team is actively working on your case, and we'll
//                                         provide updates until resolution is reached.
//                                     </p>
//                                 </td>
//                             </tr>

//                             {/* Next steps */}
//                             <tr>
//                                 <td style={{ padding: '10px 20px 12px 20px' }}>
//                                     <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>⚡ Next Steps:</p>
//                                     <table cellPadding="0" cellSpacing="0" width="100%" style={{ marginBottom: '15px' }}>
//                                         <tr>
//                                             <td width="20" valign="top" style={{ padding: '0 8px 8px 0' }}>•</td>
//                                             <td style={{ padding: '0 0 8px 0' }}>A dedicated support agent is now assigned to expedite your ticket.</td>
//                                         </tr>
//                                         <tr>
//                                             <td width="20" valign="top" style={{ padding: '0 8px 8px 0' }}>•</td>
//                                             <td style={{ padding: '0 0 8px 0' }}>You will receive updates as progress is made.</td>
//                                         </tr>
//                                         <tr>
//                                             <td width="20" valign="top" style={{ padding: '0 8px 0 0' }}>•</td>
//                                             <td style={{ padding: '0' }}>
//                                                 If you require immediate assistance, you can reach us at{' '}
//                                                 <a href="mailto:support@chatboq.com" style={{ color: '#9500FF', textDecoration: 'underline' }}>
//                                                     support@chatboq.com
//                                                 </a>
//                                             </td>
//                                         </tr>
//                                     </table>
//                                 </td>
//                             </tr>

//                             {/* Closing */}
//                             <tr>
//                                 <td style={{ padding: '0px 20px 20px 20px' }}>
//                                     <p style={{ margin: '0 0 30px 0' }}>Thank you for your patience and understanding. We value your trust in Chatboq and are committed to resolving this issue as quickly as possible.</p>
//                                     <p style={{ margin: '0' }}>Sincerely,</p>
//                                     <p style={{ margin: '0', fontWeight: '600' }}>The Chatboq Support Team</p>
//                                 </td>
//                             </tr>
//                         </table>

//                         {/* Footer outside the bordered content */}
//                         {/* <table
//                             border="0"
//                             cellPadding="0"
//                             cellSpacing="0"
//                             width="600"
//                             style={{
//                                 borderCollapse: 'collapse',
//                                 marginTop: '20px',
//                                 fontFamily: 'Outfit, Arial, sans-serif',
//                                 fontSize: '12px',
//                                 color: '#777777'
//                             }}
//                         >
//                             <tr>
//                                 <td align="center">
//                                     © {new Date().getFullYear()} Chatboq. All rights reserved.
//                                 </td>
//                             </tr>
//                         </table> */}
//                     </td>
//                 </tr>
//             </table>
//         </div>
//     );
// };

// export default Email;
