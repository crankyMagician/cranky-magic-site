# Costs and Free Tier Limitations for PostHog and Sentry

## PostHog Pricing Structure

### Free Tier ("Open Source")
- **Event Volume**: Up to 1 million events per month
- **Data Retention**: 3 months standard
- **Users**: Unlimited team members
- **Features**: Core analytics, session recording, feature flags, A/B testing, surveys
- **Duration**: Permanent (doesn't expire as long as you stay within limits)

### Cloud Paid Plans
- **Team Plan**: Starting at $450/month for 5 million events
- **Enterprise Plan**: Custom pricing, typically starting around $2,000/month
- **Additional Events**: ~$0.00045 per event above your plan limit

### Self-Hosted Edition (PostHog Cloud)
- **Cost Structure**: Similar to cloud, but with more flexibility
- **Infrastructure**: You pay your own cloud costs plus PostHog licensing

## Sentry Pricing Structure

### Free Tier ("Developer")
- **Event Volume**: 5,000 errors per month
- **Data Retention**: ~90 days
- **Team Members**: Limited to 1 member
- **Features**: Basic error tracking, limited performance monitoring
- **Duration**: Permanent (doesn't expire as long as you stay within limits)

### Cloud Paid Plans
- **Team Plan**: Starting at $26/month for 50,000 errors
- **Business Plan**: Starting at $80/month for 100,000 errors
- **Enterprise Plan**: Starting around $1,000/month

### Self-Hosted (Sentry On-Premise)
- **License Cost**: Starts at approximately $1,500/year
- **Infrastructure**: Additional costs for your own infrastructure

## Free Tier Limitations

### PostHog
1. **Scale Limitations**: 1 million events can be reached quickly in a moderate-sized application (approximately 10,000 active users with basic tracking)
2. **Feature Limitations**: Advanced features like correlation analysis and experimentation have usage caps
3. **Support Limitations**: Only community support available

### Sentry
1. **Team Limitations**: Only one team member on the free plan
2. **Volume Constraints**: 5,000 errors can be exceeded quickly in development or with a moderate user base
3. **Performance Monitoring**: Limited in the free tier
4. **Resolution Limitations**: Limited issue merging and management

## Real-World Cost Examples

For a typical application with:
- 50,000 monthly active users
- Standard instrumentation (tracking key actions)
- Basic error tracking

You might expect:
- **PostHog**: ~$600-800/month (based on ~15-20 million events)
- **Sentry**: ~$100-200/month (based on ~100,000-200,000 error events)

For a larger application with:
- 500,000 monthly active users
- Comprehensive tracking
- Advanced error and performance monitoring

You might expect:
- **PostHog**: ~$3,000-5,000/month
- **Sentry**: ~$500-1,000/month

## Cost Optimization Strategies

1. **Selective Tracking**: Only track important events rather than everything
2. **Sampling**: Use statistical sampling for high-volume events
3. **Error Deduplication**: Implement client-side deduplication for errors
4. **Hybrid Approach**: Use free tier for development and paid plans for production
5. **Multiple Free Accounts**: For Sentry, separate projects across multiple free accounts (though against terms of service)

## When You'll Outgrow Free Tiers

- **PostHog**: With ~10,000 active users with basic tracking, or ~1,000 with comprehensive tracking
- **Sentry**: As soon as you need multiple team members or at ~5-10k users (depending on application stability)

Both services offer startup programs that can provide credits or discounts during your early growth stages if you qualify. These programs can extend your "free" usage significantly, sometimes offering $5,000-$10,000 in credits for qualifying startups.

The cost difference between these services versus building and maintaining your own analytics system typically still favors the commercial options until you reach very large scale (usually millions of MAUs or hundreds of millions of events per month).