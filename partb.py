import requests
from rich.console import Console
from rich.table import Table

def fetch_swapi_data():
    url = f"https://swapi.info/api/planets"
    try:
        response = requests.get(url)
        response.raise_for_status() 
        data = response.json()

        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

planets = fetch_swapi_data()
console = Console()

table = Table(show_header=True, header_style="bold magenta")
table.add_column("Planet Name", style="dim", width=12)
table.add_column("Diameter")
table.add_column("Population", justify="right")

if planets:
    for planet in planets:
        table.add_row(
            planet["name"],
            planet["diameter"],
            planet["population"])


console.print(table)
