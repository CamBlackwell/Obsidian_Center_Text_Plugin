import { Plugin, PluginSettingTab, App, Setting } from 'obsidian';

interface centerTextSettings {
	centerEnabled: boolean; //initialise the plugin's saved data to be one boolean
	maxWidth: number;
}

const DEFAULT_SETTINGS: centerTextSettings = {
	centerEnabled: false,
	maxWidth: 100,
}



export default class centerTextPlugin extends Plugin {
	settings: centerTextSettings;
	styleEl: HTMLStyleElement; //is a reference to a <Style> tag that gets injected into the page

	async onload() {
		await this.loadSettings();


		this.styleEl = document.createElement("style"); //creates and injects the style tag into <head>
		this.styleEl.id = "center-text-plugin-style";
		document.head.appendChild(this.styleEl);

		this.applyStyle(); //applies saved state on load

		const ribbonIcon = this.addRibbonIcon(
			"align-center",
			"Toggle center Text",
			() => {
				this.settings.centerEnabled = !this.settings.centerEnabled;
				this.applyStyle();
				this.saveSettings();
				this.updateRibbonIcon(ribbonIcon);
			}
		);
		this.updateRibbonIcon(ribbonIcon);

		this.addCommand({
			id: "toggle-center-text",
			name: "Toggle center Text",
			callback: () => {
				this.settings.centerEnabled = !this.settings.centerEnabled; //flip condition
				this.applyStyle();
				this.saveSettings();
				this.updateRibbonIcon(ribbonIcon);
			}
		});

		this.addCommand({
			id: "increase-center-text-width",
			name: "Increase text width",
			callback: () => {
				this.settings.maxWidth = Math.min(100, this.settings.maxWidth + 5);
				this.applyStyle();
				this.saveSettings();
			}
		});

		this.addCommand({
			id: "decrease-center-text-width",
			name: "Decrease text width",
			callback: () => {
				this.settings.maxWidth = Math.max(20, this.settings.maxWidth - 5);
				this.applyStyle();
				this.saveSettings();
			}
		});

		this.addSettingTab(new centerTextSettingsTab(this.app, this));
	}

	onunload() {
		this.styleEl.remove();
	}

	applyStyle() {
		document.body.toggleClass("center-text-enabled", this.settings.centerEnabled);
		document.body.style.setProperty("--center-text-max-width", `${this.settings.maxWidth}%`);
	}

	updateRibbonIcon(iconEl: HTMLElement) {
		iconEl.toggleClass("is-active", this.settings.centerEnabled);
		iconEl.setAttribute("aria-label", this.settings.centerEnabled ? "centering is on" : "centering is off");
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class centerTextSettingsTab extends PluginSettingTab { //a separate class that builds the ui for the settings page
	plugin: centerTextPlugin;

	constructor(app: App, plugin: centerTextPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "center Text Settings" });

		new Setting(containerEl)
			.setName("center All text")
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
					.setLimits(20, 100, 5)   // min, max, step
					.setValue(this.plugin.settings.maxWidth)
					.onChange(async (value) => {
						this.plugin.settings.maxWidth = value;
						// update the desc label live as you drag
						slider.sliderEl.parentElement?.previousElementSibling
							?.querySelector(".setting-item-description")
							?.setText(`${value}%`);
						this.plugin.applyStyle();
						await this.plugin.saveSettings();
					})
			);
	}
}
