export type ChatDBProps = {
  message: string,
  timestamp: string,
  UID: string,
  username: string,
}

export type ResponseDBProps = ChatDBProps & {
  fromSlack: boolean,
}