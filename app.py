from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

def create_driver():
    chrome_driver_path = "/opt/homebrew/Caskroom/chromedriver/130.0.6723.58/chromedriver-mac-arm64/chromedriver" 
    service = Service(chrome_driver_path)
    options = webdriver.ChromeOptions()
    options.add_argument('--disable-infobars')
    options.add_argument('--start-maximized')
    options.add_argument('--disable-extensions')
    options.add_argument('--disable-popup-blocking')
    return webdriver.Chrome(service=service, options=options)

def runBamboo():
    driver = create_driver()
    url = "https://bamboo-master.vercel.app"
    driver.get(url)

    time.sleep(2) 
    driver.quit()

if __name__ == "__main__":
    generation = []
    for index in range(10):
        drivers = []
        for _ in range(10):
            driver = runBamboo()
            drivers.append(driver)
        print(index)
        generation.append(drivers)
        drivers = []
        time.sleep(10)
