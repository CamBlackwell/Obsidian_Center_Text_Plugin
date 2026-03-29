import { Plugin, PluginSettingTab, App, Setting } from 'obsidian';

interface CenterTextSettings {
	centerEnabled: boolean;
	maxWidth: number;
}

const DEFAULT_SETTINGS: CenterTextSettings = {
	centerEnabled: false,
	maxWidth: 100,
}

export default class CenterTextPlugin extends Plugin {
	settings: CenterTextSettings;

	async onload() {
		await this.loadSettings();
		this.applyStyle();

		const ribbonIcon = this.addRibbonIcon(
			"align-center",
			"Toggle center text",        // sentence case
			() => {
				this.settings.centerEnabled = !this.settings.centerEnabled;
				this.applyStyle();
				void this.saveSettings(); // void fixes floating promise
				this.updateRibbonIcon(ribbonIcon);
			}
		);
		this.updateRibbonIcon(ribbonIcon);

		this.addCommand({
			id: "toggle",              // removed plugin ID prefix
			name: "Toggle",            // removed plugin name
			callback: () => {
				this.settings.centerEnabled = !this.settings.centerEnabled;
				this.applyStyle();
				void this.saveSettings();
				this.updateRibbonIcon(ribbonIcon);
			}
		});

		this.addCommand({
			id: "increase-width",
			name: "Increase text width",
			callback: () => {
				this.settings.maxWidth = Math.min(100, this.settings.maxWidth + 5);
				this.applyStyle();
				void this.saveSettings();
			}
		});

		this.addCommand({
			id: "decrease-width",
			name: "Decrease text width",
			callback: () => {
				this.settings.maxWidth = Math.max(20, this.settings.maxWidth - 5);
				this.applyStyle();
				void this.saveSettings();
			}
		});

		this.addSettingTab(new CenterTextSettingsTab(this.app, this));
	}

	applyStyle() {
		document.body.toggleClass("center-text-enabled", this.settings.centerEnabled);
		document.body.style.setProperty("--center-text-max-width", `${this.settings.maxWidth}%`);
	}

	updateRibbonIcon(iconEl: HTMLElement) {
		iconEl.toggleClass("is-active", this.settings.centerEnabled);
		iconEl.setAttribute("aria-label", this.settings.centerEnabled ? "Center text on" : "Center text off");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()) as CenterTextSettings; // cast fixes unsafe any
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class CenterTextSettingsTab extends PluginSettingTab {
	plugin: CenterTextPlugin;

	constructor(app: App, plugin: CenterTextPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Center all text")   // sentence case
			.setDesc("When enabled, the text in notes will be centered.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.centerEnabled)
					.onChange(async (value) => {
						this.plugin.settings.centerEnabled = value;
						this.plugin.applyStyle();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Maximum text width")
			.setDesc(`${this.plugin.settings.maxWidth}%`)
			.addSlider((slider) =>
				slider
					.setLimits(20, 100, 5)
					.setValue(this.plugin.settings.maxWidth)
					.onChange(async (value) => {
						this.plugin.settings.maxWidth = value;
						slider.sliderEl.parentElement?.previousElementSibling
							?.querySelector(".setting-item-description")
							?.setText(`${value}%`);
						this.plugin.applyStyle();
						await this.plugin.saveSettings();
					})
			);
	}
}
