export interface KeycloakTokenParsed {
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  resource_access?: {
    portal?: {
      roles?: string[];
    };
  };
  [key: string]: any;
}

export interface KeycloakInstance {
  subject?: string;
  login: () => void;
  updateToken: (minValidity: number) => Promise<boolean>;
  hasRealmRole: (role: string) => boolean;
  hasResourceRole: (role: string, resource: string) => boolean;
  tokenParsed?: KeycloakTokenParsed;
  onReady?: () => void;
  onInitError?: (error: unknown) => void;
}