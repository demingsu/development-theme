import Vue, {PluginFunction, VueConstructor} from "vue";

declare class ZznodeUI {
    public static install: PluginFunction<any>;
}

declare namespace ZznodeUI {
    export interface ListLayout extends Vue {
        hiddenFooter(info: string): void;
    }
}

declare module "vue/types/vue" {
    export interface Vue {
        $zznode: {
            
        }
    }
}

export = ZznodeUI;