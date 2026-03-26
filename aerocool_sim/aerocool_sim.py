import customtkinter as ctk
import requests
import threading
import json
import os
import time

# --- CONFIG ---
MASTER_IP = "127.0.0.1" # Using localhost since everything is on your G16
API_URL = f"http://{MASTER_IP}:8000/api/telemetry"
CACHE_FILE = "sim_cache.json"

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

class AeroCoolSimulator(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("AeroCool Edge Node Simulator")
        self.geometry("500x800") # Made slightly taller to fit the switch
        
        # Physics State
        self.battery_level = 100.0
        self.last_tick_time = time.time()

        # UI Components
        self.header = ctk.CTkLabel(self, text="🧊 AeroCool Telemetry Engine", font=("Courier", 24, "bold"))
        self.header.pack(pady=20)

        # Temp Slider
        self.temp_label = ctk.CTkLabel(self, text="Internal Temperature: 4.0 °C", font=("Arial", 16))
        self.temp_label.pack(pady=10)
        self.temp_slider = ctk.CTkSlider(self, from_=-10.0, to=30.0, command=self.update_ui)
        self.temp_slider.set(4.0)
        self.temp_slider.pack(pady=10, padx=20, fill="x")

        # --- ALERT LIGHT ---
        self.alert_frame = ctk.CTkFrame(self, corner_radius=100, width=50, height=50, fg_color="green")
        self.alert_frame.pack(pady=10)
        self.alert_text = ctk.CTkLabel(self, text="SYSTEM NOMINAL", text_color="green", font=("Arial", 12, "bold"))
        self.alert_text.pack()

        # Status Display
        self.fan_label = ctk.CTkLabel(self, text="⚙️ COOLING: PASSIVE", text_color="gray", font=("Arial", 18, "bold"))
        self.fan_label.pack(pady=15)

        # --- SOLAR SWITCH ---
        self.solar_switch = ctk.CTkSwitch(self, text="☀️ Solar Array Active (Daytime)", font=("Arial", 14))
        self.solar_switch.select() # Starts turned ON
        self.solar_switch.pack(pady=15)

        # Battery Section
        self.batt_label = ctk.CTkLabel(self, text="Battery: 100%", font=("Arial", 14))
        self.batt_label.pack()
        self.batt_bar = ctk.CTkProgressBar(self, width=350)
        self.batt_bar.set(1.0)
        self.batt_bar.pack(pady=10)

        # Sync Status
        self.cache_label = ctk.CTkLabel(self, text="Sync Status: Live", text_color="green", font=("Arial", 12))
        self.cache_label.pack()

        # Terminal
        self.log_box = ctk.CTkTextbox(self, height=150, width=450, font=("Courier", 12), text_color="#00ff00")
        self.log_box.pack(pady=20)

        self.engine_tick()

    def update_ui(self, val):
        temp = round(float(val), 1)
        self.temp_label.configure(text=f"Internal Temperature: {temp} °C")
        
        # 1. Cooling Logic (Fan)
        if temp >= 8.0:
            self.fan_label.configure(text="⚙️ COOLING: ACTIVE", text_color="#00f2fe")
        else:
            self.fan_label.configure(text="⚙️ COOLING: PASSIVE", text_color="gray")

        # 2. Alert Light Logic (Red if < 2°C or > 8°C)
        if temp < 2.0 or temp > 8.0:
            self.alert_frame.configure(fg_color="red")
            status = "CRITICAL: FREEZE" if temp < 2.0 else "CRITICAL: HEAT"
            self.alert_text.configure(text=status, text_color="red")
        else:
            self.alert_frame.configure(fg_color="green")
            self.alert_text.configure(text="SYSTEM NOMINAL", text_color="green")

    def engine_tick(self):
        temp = round(self.temp_slider.get(), 1)
        is_solar = self.solar_switch.get() == 1
        extreme_temp = temp >= 8.0 or temp < 2.0
        
        # --- SMART BATTERY PHYSICS ---
        if is_solar:
            # Daytime: Charging
            charge_rate = 0.5 if extreme_temp else 1.5
            self.battery_level = min(100.0, self.battery_level + charge_rate)
        else:
            # Nighttime: Draining
            drain_rate = 2.0 if extreme_temp else 0.5
            self.battery_level = max(0.0, self.battery_level - drain_rate)
        
        # Update UI Bar
        self.batt_bar.set(self.battery_level / 100.0)
        
        # Change battery text color if it gets low
        batt_color = "red" if self.battery_level < 20.0 else "white"
        self.batt_label.configure(text=f"Battery: {round(self.battery_level, 1)}%", text_color=batt_color)

        # Payload
        payload = {
            "device_id": "AERO-G16-SIM",
            "temperature": temp,
            "battery_level": round(self.battery_level, 1),
            "power_source": "Solar Array" if is_solar else "Internal Battery",
            "fan_status": "ON" if temp >= 8.0 else "OFF",
            "alert_level": "RED" if extreme_temp else "GREEN"
        }

        threading.Thread(target=self.transmit, args=(payload,)).start()
        self.after(2000, self.engine_tick) # Tick every 2 seconds

    def transmit(self, payload):
        try:
            requests.post(API_URL, json=payload, timeout=1)
            self.log_box.insert("end", f"[SUCCESS] Data Sent: {payload['temperature']}°C\n")
            self.cache_label.configure(text="Sync Status: Live", text_color="green")
            self.log_box.see("end")
            
            if os.path.exists(CACHE_FILE):
                self.sync_offline_data()
        except:
            self.save_to_cache(payload)
            self.log_box.insert("end", f"[OFFLINE] Data Cached\n")
            self.log_box.see("end")

    def save_to_cache(self, payload):
        data = []
        if os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, 'r') as f: data = json.load(f)
            except: data = []
        data.append(payload)
        with open(CACHE_FILE, 'w') as f: json.dump(data, f)
        self.cache_label.configure(text=f"Sync Status: {len(data)} items cached", text_color="orange")

    def sync_offline_data(self):
        try:
            with open(CACHE_FILE, 'r') as f: data = json.load(f)
            for item in data:
                requests.post(API_URL, json=item, timeout=1)
            os.remove(CACHE_FILE)
            self.log_box.insert("end", "✅ Cache Synced to Backend!\n")
            self.log_box.see("end")
        except:
            pass

if __name__ == "__main__":
    app = AeroCoolSimulator()
    app.mainloop()