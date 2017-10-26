import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

export class AdsManager {

    mAdmobFree: AdMobFree;

    mTimeCheck: number = 0;

    mAdsEnable: boolean = false;

    public setAdmobFree(admobFree: AdMobFree) {
        if (!this.mAdsEnable) return;
        if (!admobFree) return;
        if (!this.mAdmobFree) {
            this.mAdmobFree = admobFree;
            this.load();
        }
    }

    public load() {

    }

    private loadAndroid() {
        if (!this.mAdmobFree) return;
        const bannerConfig: AdMobFreeBannerConfig = {
            autoShow: true,
            id: "ca-app-pub-5504805357330554/5250257224",
            overlap: true,
            isTesting: false,
            offsetTopBar: true
        };

        this.mAdmobFree.banner.config(bannerConfig);

        this.mAdmobFree.banner.prepare();

        let interstitialConfig: AdMobFreeInterstitialConfig = {
            autoShow: false,
            id: "ca-app-pub-5504805357330554/6726990422",
            isTesting: false

        };

        this.mAdmobFree.interstitial.config(interstitialConfig);

        this.mAdmobFree.interstitial.prepare();
    }

    private loadIOS() {
        if (!this.mAdmobFree) return;
        const bannerConfig: AdMobFreeBannerConfig = {
            autoShow: true,
            id: "ca-app-pub-5504805357330554/9680456825",
            overlap: true,
            isTesting: false,
            offsetTopBar: true
        };

        this.mAdmobFree.banner.config(bannerConfig);

        this.mAdmobFree.banner.prepare();

        let interstitialConfig: AdMobFreeInterstitialConfig = {
            autoShow: false,
            id: "ca-app-pub-5504805357330554/2157190026",
            isTesting: false

        };

        this.mAdmobFree.interstitial.config(interstitialConfig);

        this.mAdmobFree.interstitial.prepare();
    }

    public showInterstital(force: boolean = true) {
        if (!this.mAdsEnable) return;
        if (force) {
            this.mAdmobFree.interstitial.show();
        }
        this.mTimeCheck++;
        if (this.mTimeCheck >= 10) {
            if (this.mAdmobFree) this.mAdmobFree.interstitial.show();
            this.mTimeCheck = 0;
        }
    }


}