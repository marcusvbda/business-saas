import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { setActiveSubscriptionFromStripe } from '@/server/subscriptions';

export async function POST(req: NextRequest) {
	const secret = process.env.STRIPE_WEBHOOK_SECRET;
	const key = process.env.STRIPE_SECRET_KEY;
	if (!secret || !key)
		return new Response('Stripe not configured', { status: 500 });

	const stripe = new Stripe(key, { apiVersion: '2024-06-20' });
	const sig = req.headers.get('stripe-signature') as string;
	const rawBody = await req.text();

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, sig, secret);
	} catch (err: any) {
		return new Response(`Webhook Error: ${err.message}`, { status: 400 });
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session;
				if (
					session.mode === 'subscription' &&
					session.subscription &&
					session.customer
				) {
					const subscription = await stripe.subscriptions.retrieve(
						session.subscription as string,
					);
					await setActiveSubscriptionFromStripe({
						plan: (session.metadata?.plan as string) || 'unknown',
						stripeCustomerId: session.customer as string,
						stripeSubscriptionId: subscription.id,
						status: subscription.status,
						periodStart: subscription.current_period_start
							? new Date(subscription.current_period_start * 1000)
							: null,
						periodEnd: subscription.current_period_end
							? new Date(subscription.current_period_end * 1000)
							: null,
					});
				}
				break;
			}
			case 'customer.subscription.updated':
			case 'customer.subscription.deleted': {
				const sub = event.data.object as Stripe.Subscription;
				await setActiveSubscriptionFromStripe({
					plan:
						(sub.items.data[0]?.price.nickname as string) ||
						sub.items.data[0]?.price.id ||
						'unknown',
					stripeCustomerId: sub.customer as string,
					stripeSubscriptionId: sub.id,
					status: sub.status,
					periodStart: sub.current_period_start
						? new Date(sub.current_period_start * 1000)
						: null,
					periodEnd: sub.current_period_end
						? new Date(sub.current_period_end * 1000)
						: null,
				});
				break;
			}
		}
	} catch (e: any) {
		return new Response('Handler error: ' + e.message, { status: 500 });
	}

	return new Response('ok');
}

export const dynamic = 'force-dynamic';
