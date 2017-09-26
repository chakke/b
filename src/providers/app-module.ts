import { ResourceLoader } from './resource-loader/resource-loader';
import { ScrollController } from './common/scroll-controller';
import { AppLoop } from './app-loop';

export class AppModule {

    private mResourceLoader: ResourceLoader;

    private mScrollController: ScrollController;

    private static _instance: AppModule = null;

    private constructor() {
        this.mResourceLoader = new ResourceLoader();
        this.mScrollController = new ScrollController();
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

    public getScrollController(){
        return this.mScrollController;
    }

}