import { chatbotImpl } from "../logic/chatbotImpl";
import userImpl from "../logic/userImpl";
import { chatbotState } from "../slices/chatbotSlice";
import { userState } from "../slices/userSlice";

export interface chatbotStateExtended extends chatbotState {
  ipAddress?: string;
  userAgent?: string;
}

export class chatbotBackendImpl
  extends chatbotImpl
  implements chatbotStateExtended
{
  ipAddress?: string;
  userAgent?: string;

  initSuper(data: chatbotState) {
    super.initFromState(data);
  }

  initFromState(data: chatbotStateExtended) {
    if (data.ipAddress) {
      this.ipAddress = data.ipAddress;
    }

    if (data.userAgent) {
      this.userAgent = data.userAgent;
    }
  }

  initDataFromBackend(data: chatbotState) {
    super.initFromState(data);
    super.initDataFromBackend(data);
  }
  setUser(user: userState) {
    if (user) {
      const userImplHandler = new userImpl();
      userImplHandler.initDataFromBackend(user);
      this.user = userImplHandler;
    }
  }
  setIpAddress(ipAddress: string) {
    this.ipAddress = ipAddress;
  }

  setUserAgent(userAgent: string) {
    this.userAgent = userAgent;
  }
}
