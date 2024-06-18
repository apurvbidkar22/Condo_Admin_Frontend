export interface Option {
    label: string
    value: string
}

//Snackbar
export type AlertType = "success" | "warning" | "error";
export interface SnackbarMessage {
    type: AlertType;
    message: string;
}

//Tabs
export interface Tab {
    name: string
    content: React.ReactNode
}
