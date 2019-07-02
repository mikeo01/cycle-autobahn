import { Connection, Session, IPublishOptions, RegisterEndpoint, IRegisterOptions } from "autobahn";
export interface RPCRegistration {
    register: {
        name: string;
        procedure: RegisterEndpoint;
        options?: IRegisterOptions;
    };
}
export interface Publish {
    publish: {
        topic: string;
        args: Array<any>;
        kwargs?: any;
        options?: IPublishOptions;
    };
}
export interface Close {
    close: Boolean;
}
export declare type ISessionSetup = Publish | RPCRegistration | Close;
export declare function handle(sink: ISessionSetup, session: Session, client: Connection): void;
