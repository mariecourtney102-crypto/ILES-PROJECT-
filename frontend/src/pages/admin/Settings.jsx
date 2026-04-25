const Settings = () => {
  const renderAppearanceSettings = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="color"
            className="w-12 h-12 rounded border-gray-300 cursor-pointer"
            value={settings.appearance.primaryColor}
            onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
          />
          <span className="text-sm text-gray-600">Choose your brand color</span>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-200">
          <div>
            <p className="font-medium text-gray-800">Compact Mode</p>
            <p className="text-sm text-gray-500">Reduce spacing for denser information display</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.appearance.compactMode}
              onChange={(e) => handleChange('appearance', 'compactMode', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>
    );
  };

  const renderSecuritySettings = () => {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-xs text-yellow-700 mt-1">
            Changing security settings will affect all users. Please ensure you have proper authorization
          </p>
        </div>
      </div>
    );
  };

  // Your theme selection (fixing the map)
  const renderThemeSettings = () => {
    const themes = ["Light", "Dark", "System"];
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <div className="flex space-x-3">
            {themes.map((theme) => (
              <button key={theme} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Appearance Settings</h2>
      {renderAppearanceSettings()}
      
      <h2 className="text-xl font-bold mb-4 mt-6">Security Settings</h2>
      {renderSecuritySettings()}
      
      <h2 className="text-xl font-bold mb-4 mt-6">Theme Settings</h2>
      {renderThemeSettings()}
    </div>
  );
};

export default Settings;