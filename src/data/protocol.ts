export type ListID = string;
export type ItemID = string;

// Messages processable by the server
export type SERVER_CREATE_NEW_LIST = { type: "SERVER_CREATE_NEW_LIST", name: string, data: Object, clientListId: ListID };
export type SERVER_DELETE_LIST = { type: "SERVER_DELETE_LIST", ListID: ListID };
export type SERVER_UPDATE_LIST_NAME = { type: "SERVER_UPDATE_LIST_NAME", ListID: ListID, name: string };
export type SERVER_UPDATE_LIST_DATA = { type: "SERVER_UPDATE_LIST_DATA", ListID: ListID, data: Object };

export type SERVER_CREATE_ITEM = {  type: "SERVER_CREATE_ITEM", ListID: ListID,
  label: string, checked: boolean, data: dataForItem, clientItemId: ItemID };
export type SERVER_DELETE_ITEM = { type: "SERVER_DELETE_ITEM", ListID: ListID, ItemID: ItemID };
export type SERVER_UPDATE_ITEM_CHECK = { type: "SERVER_UPDATE_ITEM_CHECK", ListID: ListID, ItemID: ItemID, check: boolean };
export type SERVER_UPDATE_ITEM_LABEL = { type: "SERVER_UPDATE_ITEM_LABEL", ListID: ListID, ItemID: ItemID, label: string };
export type SERVER_UPDATE_ITEM_DATA = { type: "SERVER_UPDATE_ITEM_DATA", ListID: ListID, ItemID: ItemID, data: dataForItem };

export type TODOLISTS_NEW_STATE = {
  type: "TODOLISTS_NEW_STATE",
  lists: TodoListJSON[],
  items: ItemJSON[]
};
export type MESSAGE_FOR_SERVER = SERVER_CREATE_NEW_LIST | SERVER_DELETE_LIST | SERVER_UPDATE_LIST_NAME |
  SERVER_CREATE_ITEM | SERVER_DELETE_ITEM | SERVER_UPDATE_ITEM_CHECK | SERVER_UPDATE_ITEM_LABEL |
  SERVER_UPDATE_LIST_DATA | SERVER_UPDATE_ITEM_DATA |
  TODOLISTS_NEW_STATE;

// Messages processable by the clients
export type MESSAGE_FOR_CLIENT = TODOLISTS_NEW_STATE;

// Data types
export type PassportUser = {
  id: string,
  name: string,
  token: any,
  emails: string[],
  photos: string[],
  provider: "facebook" | "google";
};

export type dataForItem = {
  participants: string[],
  dateI: string,
  couleur: string
};
export type ItemJSON = {
  label: string,
  checked: boolean,
  date: number,
  id: ItemID,
  clock: number,
  data: dataForItem // Possible extensions
};

export type TodoListJSON = {
  name: string,
  items: ItemID[],
  id: ListID,
  clock: number,
  data: Object // Possible extensions
};

export type dataForListWithItems ={
  description: string,
  checked: boolean
};

export type TodoListWithItems = {
  name: string,
  id: ListID,
  items: ItemJSON[],
  clock: number,
  data: dataForListWithItems // Possible extensions
};
