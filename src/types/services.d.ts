interface ReplicatedStorage {
	"rbxts_include": Folder & {
		Promise: ModuleScript;
		RuntimeLib: ModuleScript;
	};
	"TS": Folder & {
		assets: ModuleScript;
		constants: ModuleScript;
		functions: Folder & {
			"game-config": ModuleScript;
			"setup-logger": ModuleScript;
		};
		modules: Folder & {
			"3d-sound-system": ModuleScript;
		};
		network: ModuleScript;
		store: ModuleScript & {
			middleware: Folder & {
				profiler: ModuleScript;
			};
			persistent: ModuleScript & {
				"persistent-selectors": ModuleScript;
				"persistent-slice": ModuleScript & {
					"achievements": ModuleScript;
					"balance": ModuleScript;
					"default-data": ModuleScript;
					"mtx": ModuleScript;
					"settings": ModuleScript;
				};
			};
		};
		util: Folder & {
			"core-call": ModuleScript;
			"flamework-util": ModuleScript;
			"physics-util": ModuleScript;
			"player-util": ModuleScript;
		};
	};
	"TS-types": Folder & {
		enum: Folder & {
			badge: ModuleScript;
			mtx: ModuleScript;
			tag: ModuleScript;
		};
		interfaces: Folder;
		util: Folder;
	};
}

interface ServerScriptService {
	TS: Folder & {
		"mtx-service": ModuleScript;
		"network": ModuleScript;
		"player": Folder & {
			"character": Folder & {
				"character-service": ModuleScript;
			};
			"data": Folder & {
				"player-data-service": ModuleScript;
				"validate-data": ModuleScript;
			};
			"leaderstats-service": ModuleScript;
			"player-badge-service": ModuleScript;
			"player-entity": ModuleScript;
			"player-removal-service": ModuleScript;
			"player-service": ModuleScript;
			"with-player-entity": ModuleScript;
		};
		"runtime": Script;
		"store": ModuleScript & {
			middleware: Folder & {
				broadcaster: ModuleScript;
			};
		};
	};
}

interface Workspace {
	Baseplate: Part;
}
