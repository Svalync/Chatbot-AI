import axiosInstance from "@/lib/axios";
import { userState } from "../slices/userSlice";
import AllAPIRouteMapping from "@/utils/AllAPIRouteMapping";
import userCredentialsController from "@/controllers/UserCredentialsController";
import { userCredentialState } from "../slices/userCredentialSlice";
import { userCredentialImpl } from "./userCredentialImpl";

export default class userImpl implements userState {
  id: string = "";
  name: string = "";
  image: string = "";
  email: string = "";
  tokens: Number | undefined;
  loading: boolean = false;
  userCredentials: userCredentialState[] = [];

  init() {}

  initDataFromBackend(data: userState) {
    if (data.id) {
      this.id = data.id;
    }
    if (data.name) {
      this.name = data.name;
    }
    if (data.image) {
      this.image = data.image;
    }
    if (data.email) {
      this.email = data.email;
    }
    if (data.tokens) {
      this.tokens = data.tokens;
    }
    if (data.loading) {
      this.loading = data.loading;
    }
    if (data.userCredentials) {
      for (let userCredential of data.userCredentials) {
        const userCredentialImplHandler = new userCredentialImpl();
        userCredentialImplHandler.initDataFromBackend(userCredential);
        this.userCredentials.push(userCredentialImplHandler);
      }
    }
  }

  async initUserFromBackend(): Promise<userState> {
    const axiosInstanceHandler = new axiosInstance();
    const response = await axiosInstanceHandler.makeCall(
      AllAPIRouteMapping.users.getUser.apiPath,
      AllAPIRouteMapping.users.getUser.method
    );
    if (response?.user) {
      this.id = response?.user.id;
      this.email = response?.user.email;
      this.image = response?.user.image;
      this.name = response?.user.name;
      this.tokens = response?.user.tokens;
    }
    return this;
  }

  static decreaseToken(userId: string, amount: number) {
    if (typeof window === "undefined") {
      // Logic to decrease tokens
      const userCredentialsControllerHandler = new userCredentialsController();
      userCredentialsControllerHandler.decreaseTokens(userId, amount);
    }
  }
}
