export interface ISession {
  _id: string;
  url: string;
  owner: string;
  quesiton: string;
  title: string;
}

export interface ICreateSession {
  url: string;
  owner: string;
  quesiton: string;
  title: string;
}

export interface IUpdateSession {
  url: string;
  owner: string;
  quesiton: string;
  title: string;
}
