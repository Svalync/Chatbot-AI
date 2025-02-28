import axiosInstance from '@/lib/axios';
import { UserCredentialFormSchemaType } from '@/schemas/userCredential.index';
import AllAPIRouteMapping from '@/utils/AllAPIRouteMapping';
import { userCredentialState } from '../slices/userCredentialSlice';

export class userCredentialImpl implements userCredentialState {
  id: string = '';
  userId: string = '';
  tokens: number = 0;
  companyName: string = '';
  companyDescription: string = '';
  companyUrl: string = '';
  companyLogo: string = '';
  apiKey: string = '';
  loading: boolean = false;

  initFromState(data: userCredentialState) {
    if (data.id) {
      this.id = data.id;
    }
    if (data.userId) {
      this.userId = data.userId;
    }
    if (data.tokens) {
      if (typeof data.tokens === 'bigint') {
        this.tokens = Number(data.tokens);
      } else {
        this.tokens = data.tokens;
      }
    }
    if (data.companyName) {
      this.companyName = data.companyName;
    }
    if (data.companyDescription) {
      this.companyDescription = data.companyDescription;
    }
    if (data.companyUrl) {
      this.companyUrl = data.companyUrl;
    }
    if (data.companyLogo) {
      this.companyLogo = data.companyLogo;
    }
    if (data.apiKey) {
      this.apiKey = data.apiKey;
    }
  }

  initDataFromBackend(data: userCredentialState) {
    this.initFromState(data);
  }

  initFromAny(data: any) {
    this.initFromState(data);
  }

  initDataFromBackendForIframe(data: userCredentialState) {
    if (data.id) {
      this.id = data.id;
    }
    if (data.companyName) {
      this.companyName = data.companyName;
    }
    if (data.companyDescription) {
      this.companyDescription = data.companyDescription;
    }
    if (data.companyUrl) {
      this.companyUrl = data.companyUrl;
    }
    if (data.companyLogo) {
      this.companyLogo = data.companyLogo;
    }
  }

  async convertImageToString(image: File): Promise<{ image: string; name: string }> {
    return new Promise((resolve) => {
      if (image) {
        const reader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
          const changedImage = e.target?.result;
          if (changedImage) {
            const uploadJson = {
              image: changedImage as string,
              name: image.name,
            };
            resolve(uploadJson);
          }
        };
        reader.readAsDataURL(image);
      }
    });
  }

  async createUserCredential(data: UserCredentialFormSchemaType) {
    let imageUrl = '';

    // Check if companyLogo is a valid file
    if (data.companyLogo && typeof data.companyLogo !== 'string') {
      const imageJson = await this.convertImageToString(data.companyLogo as unknown as File);

      // if (imageJson?.image && imageJson?.name) {
      //   imageUrl = await workflowEditorImpl.handleImageUpload(imageJson.image, imageJson.name);
      // }
    }

    // Construct the payload
    const payload = {
      companyName: data.companyName,
      companyDescription: data.companyDescription,
      companyUrl: data.companyUrl,
      companyLogo: imageUrl,
    };

    // Make the API call
    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setPayload(payload);

    try {
      const response: any = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.userCredential.create.apiPath, AllAPIRouteMapping.userCredential.create.method);
  
      return response;
    } catch (error) {
      console.error('Error creating user credentials:', error);
      throw error;
    }
  }
  async getUserCredential() {
    const axiosInstanceHandler = new axiosInstance();
    const response: any = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.userCredential.getData.apiPath, AllAPIRouteMapping.userCredential.getData.method);
    if (response.success) {
      return response.data;
    }
  }

  async setApiKey(apiKey: string): Promise<any> {
    const paylod = {
      apiKey,
    };

    const axiosInstanceHandler = new axiosInstance();
    axiosInstanceHandler.setPayload(paylod);
    const response: any = await axiosInstanceHandler.makeCall(AllAPIRouteMapping.userCredential.createAPIKey.apiPath, AllAPIRouteMapping.userCredential.createAPIKey.method);
    if (response.success) {
      return response.data;
    }
  }
}
