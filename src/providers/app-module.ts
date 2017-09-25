import { ResourceLoader } from './resource-loader/resource-loader';

export class AppModule {

    private mResourceLoader: ResourceLoader;

    private static _instance: AppModule = null;

    private constructor() {
        this.mResourceLoader = new ResourceLoader();
    }

    public static getInstance() {
        if (this._instance == null) {
            this._instance = new AppModule();
        }
        return this._instance;
    }

    public getResourceLoader() {

        return this.mResourceLoader;
    }

}