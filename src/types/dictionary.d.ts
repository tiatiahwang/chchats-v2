export type Activities = {
  button: string;
  myposts: string;
  mycomments: string;
  myscrap: string;
  nopost: string;
  nocomment: string;
  noscrap: string;
};

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
