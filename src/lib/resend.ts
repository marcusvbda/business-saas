import { Resend } from 'resend';

export const sendEmail = async (key: string, settings: any) => {
	const resend = new Resend(process.env.RESEND_API_KEY || '');
	return resend.emails.send(settings);
};
