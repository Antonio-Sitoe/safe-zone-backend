export interface DbAttr<ID = string> {
	id: ID;
	isDeleted?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export type DbAttrKeys = keyof DbAttr;

export type ElementProps<El = HTMLDivElement> = React.AllHTMLAttributes<El>;

export type UndoPartial<T> = { [P in keyof T]: T[P] };
