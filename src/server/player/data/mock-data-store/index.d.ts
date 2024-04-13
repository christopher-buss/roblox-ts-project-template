/** @see https://github.com/nezuo/data-store-service-mock/tree/master */
interface DataStoreServiceMock {
	GetDataStore(
		this: DataStoreService,
		name: string,
		scope?: string,
		options?: DataStoreOptions,
	): DataStore;
	GetRequestBudgetForRequestType(
		this: DataStoreService,
		requestType: CastsToEnum<Enum.DataStoreRequestType>,
	): number;
	manual(): void;
}

type DataStoreServiceMockConstructor = new () => DataStoreServiceMock;

declare const DataStoreServiceMock: DataStoreServiceMockConstructor;

export = DataStoreServiceMock;
