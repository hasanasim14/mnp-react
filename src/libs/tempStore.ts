// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tempSessionID: any = null;
let errorState: string = "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setTempSessionID = (val: any) => {
  tempSessionID = val;
};

export const setTempErrorMessage = (val: string) => {
  errorState = val;
};

export const getTempSessionID = () => tempSessionID;
export const getTempErrorMessage = () => errorState;
