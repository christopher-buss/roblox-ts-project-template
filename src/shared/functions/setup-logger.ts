import Log, { Logger, LogLevel } from "@rbxts/log";
import type { ILogEventSink, LogEvent } from "@rbxts/log/out/Core";
import { MessageTemplateParser, PlainTextMessageTemplateRenderer } from "@rbxts/message-templates";
import { RunService } from "@rbxts/services";

import { $package } from "rbxts-transform-debug";
import { $NODE_ENV } from "rbxts-transform-env";

export const LOG_LEVEL: LogLevel =
	$NODE_ENV === "development" ? LogLevel.Debugging : LogLevel.Information;

const Environment = RunService.IsClient() ? "Client" : "Server";

const STACK_TRACE_LEVEL_MODULE = 5;
const STACK_TRACE_LEVEL_FLAMEWORK = 4;

/**
 * Represents a log event sink that outputs log messages using the Roblox
 * logging functions.
 */
class LogEventSFTOutputSink implements ILogEventSink {
	public Emit(message: LogEvent): void {
		const template = new PlainTextMessageTemplateRenderer(
			MessageTemplateParser.GetTokens(message.Template),
		);

		let tag = "";

		switch (message.Level) {
			case LogLevel.Verbose: {
				tag = "VERBOSE";
				break;
			}
			case LogLevel.Debugging: {
				tag = "DEBUG";
				break;
			}
			case LogLevel.Information: {
				tag = "INFO";
				break;
			}
			case LogLevel.Warning: {
				tag = "WARN";
				break;
			}
			case LogLevel.Error: {
				tag = "ERROR";
				break;
			}
			case LogLevel.Fatal: {
				tag = "FATAL";
				break;
			}
		}

		const context = message.SourceContext ?? "Game";
		const messageResult = template.Render(message);

		let fileInfo = "";
		if (LOG_LEVEL <= LogLevel.Verbose) {
			const source =
				context === "Game"
					? debug.info(STACK_TRACE_LEVEL_MODULE, "sl")
					: debug.info(STACK_TRACE_LEVEL_FLAMEWORK, "sl");
			const [file, line] = source;
			fileInfo = ` (${file}:${line})`;
		}

		const formatted_message =
			`[${tag}] ${context} (${Environment}) - ${messageResult}` + fileInfo;

		if (message.Level >= LogLevel.Fatal) {
			error(formatted_message);
		} else if (message.Level >= LogLevel.Warning) {
			warn(formatted_message);
		} else {
			print(formatted_message);
		}
	}
}

/** Sets up the logger for the application, for both the client and server. */
export function setupLogger(): void {
	Log.SetLogger(
		Logger.configure()
			.SetMinLogLevel(LOG_LEVEL)
			.EnrichWithProperty("Version", $package.version)
			.WriteTo(new LogEventSFTOutputSink())
			.Create(),
	);
}
