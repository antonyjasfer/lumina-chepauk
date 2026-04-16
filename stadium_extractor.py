import codecs
from bs4 import BeautifulSoup
import json
import re

def extract_viagogo_data(html_file_path):
    with codecs.open(html_file_path, 'r', 'utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # 1. Extract Stadium Blueprint (SVG)
    stadium_svg = soup.find('svg', id='section-map-base')
    if stadium_svg:
        # Modify SVG attributes to make it visible standalone
        stadium_svg['viewBox'] = "-50,-50,1000,1000" 
        stadium_svg['width'] = "100%"
        stadium_svg['height'] = "100%"
        
        with open('stadium_blueprint.svg', 'w', encoding='utf-8') as svg_file:
            svg_file.write(str(stadium_svg))
        print("✅ Extracted stadium blueprint to: stadium_blueprint.svg")
    else:
        print("❌ Could not find stadium blueprint SVG.")
        
    # 2. Extract Ticket Listings
    listings = []
    ticket_elements = soup.find_all(attrs={"data-listing-id": True})
    
    for ticket in ticket_elements:
        listing_id = ticket.get("data-listing-id")
        price = ticket.get("data-price")
        feature_id = ticket.get("data-feature-id") # e.g., '265_1858799'
        
        # Parse the connection to the map coordinates
        map_sprite_id = None
        if feature_id and "_" in feature_id:
            map_sprite_id = f"s{feature_id.split('_')[-1]}"
            
        section_elem = ticket.find('h3')
        section = section_elem.text.strip() if section_elem else "Unknown Section"
        
        text_dump = ticket.get_text(separator=' | ')
        row_match = re.search(r'Row\s+([A-Z0-9]+)', text_dump)
        row = row_match.group(1) if row_match else "N/A"
        
        qty_match = re.search(r'(\d+)\s+tickets together', text_dump)
        quantity = int(qty_match.group(1)) if qty_match else 1
        
        listings.append({
            "listing_id": listing_id,
            "section": section,
            "row": row,
            "quantity": quantity,
            "price": price,
            "map_sprite_id": map_sprite_id 
        })
        
    # Save tickets to JSON
    with open('tickets.json', 'w', encoding='utf-8') as json_file:
        json.dump(listings, json_file, indent=4)
        
    print(f"✅ Extracted {len(listings)} ticket listings to: tickets.json")
    return listings

if __name__ == "__main__":
    # Point this to a saved copy of Viagogo HTML
    # extract_viagogo_data("viagogo_page_source.html")
    pass
