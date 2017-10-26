import { GoogleAnalytics } from '@ionic-native/google-analytics';

export class AnalyticsManager {

    mGoogleAnalytics: GoogleAnalytics;

    mEnable: boolean = false;

    public setGoogleAnalytics(analytics: GoogleAnalytics) {
        if (!this.mEnable) return;
        if (!analytics) return;
        if (!this.mGoogleAnalytics) {
            this.mGoogleAnalytics = analytics;
            this.mGoogleAnalytics.startTrackerWithId("UA-102760744-1");
        }
    }

    public trackScreen(screen: string) {
        if (!this.mEnable) return;
        if (this.mGoogleAnalytics) {
            this.mGoogleAnalytics.trackView("Screen : " + screen);
        }
    }
    public trackEvent(category: string, action: string, label?: string, value?: number, newSession?: boolean) {
        if (!this.mEnable) return;
        if (this.mGoogleAnalytics) {
            this.mGoogleAnalytics.trackEvent(category, action, label, value, newSession);
        }
    }
    public trackTiming(category: string, intervalInMilliseconds: number, variable: string, label: string) {
        if (!this.mEnable) return;
        if (this.mGoogleAnalytics) {
            this.mGoogleAnalytics.trackTiming(category, intervalInMilliseconds, variable, label);
        }
    }
    public setAllowIDFACollection(allow: boolean) {
        if (!this.mEnable) return;
        if (this.mGoogleAnalytics) {
            this.mGoogleAnalytics.setAllowIDFACollection(allow);
        }
    }

}