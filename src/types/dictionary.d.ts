export type Search = {
  noword: string;
  noresult: string;
  result: string;
};

export type MobileNav = {
  auth: {
    login: string;
    join: string;
  };
  profile: {
    myaccount: string;
    logout: string;
  };
  category: {
    board: string;
    qna: string;
    market: string;
    region: string;
    notice: string;
  };
};

export type Login = {
  email: string;
  password: string;
  button: string;
  loading: string;
};

export type Join = {
  email: string;
  password: string;
  nickname: string;
  button: string;
  loading: string;
};

export type CreatePost = {
  subtitle: string;
  category: string;
  subcategory: string;
  editor: {
    title: string;
    placeholder: string;
  };
  button: string;
  loading: string;
};

export type Activities = {
  button: string;
  myposts: string;
  mycomments: string;
  myscrap: string;
  nopost: string;
  nocomment: string;
  noscrap: string;
};
