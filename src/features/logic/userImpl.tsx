import { userState } from "../slices/userSlice";

export default class userImpl implements userState {
  id: string = "";
  name: string = "";
  email: string = "";
  tokens: Number | undefined;
  loading: boolean = false;

  initDataFromBackend(data: userState) {
    if (data.id) {
      this.id = data.id;
    }
    if (data.name) {
      this.name = data.name;
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
  }

//   async initUserFromBackend(): Promise<userState> {
//     const axiosInstanceHandler = new axiosInstance();
//     const response = await axiosInstanceHandler.makeCall(
//       AllAPIRouteMapping.users.getUser.apiPath,
//       AllAPIRouteMapping.users.getUser.method
//     );
//     if (response?.user) {
//       this.id = response?.user.id;
//       this.email = response?.user.email;
//       this.name = response?.user.name;
//       this.tokens = response?.user.tokens;
//     }
//     return this;
//   }
}
