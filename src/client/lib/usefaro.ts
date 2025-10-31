import {
	type BrowserConfig,
	faro,
	getWebInstrumentations,
	initializeFaro,
	LogLevel,
} from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'
import { useEffect } from 'react'

export const useFaro = (config?: BrowserConfig): void => {
	useEffect(() => {
		// check if faro is already initialized
		if (faro.api) return
		// validate config
		if (!config?.url || !config?.app.name) return
		try {
			// https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/instrument/filter-bots/
			// regular expression capturing unwanted user-agents
			const bots =
				'(googlebot/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)'
			const botsRegex = new RegExp(bots, 'i')
			// set a sampling factor of 0 for bots
			const samplingFactor = botsRegex.test(navigator.userAgent) ? 0 : 1

			initializeFaro({
				instrumentations: [
					// Mandatory, omits default instrumentations otherwise.
					...getWebInstrumentations(),

					// Tracing package to get end-to-end visibility for HTTP requests.
					// https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/instrument/tracing-instrumentation/
					new TracingInstrumentation(),
				],
				sessionTracking: {
					enabled: true,
					persistent: true,
					samplingRate: samplingFactor,
				},
				consoleInstrumentation: {
					consoleErrorAsLog: true,
					captureConsoleDisabledLevels: [
						LogLevel.INFO,
						LogLevel.DEBUG,
						LogLevel.TRACE,
					],
				},
				...config,
			} as BrowserConfig)
		} catch (e) {
			console.error('Failed to initialize Faro', e)
		}
	}, [config])
}
