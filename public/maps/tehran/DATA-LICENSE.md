# OpenStreetMap data attribution and licensing

© OpenStreetMap contributors — https://www.openstreetmap.org/copyright

Map data and the derived roads.geojson database are available under the Open Database License 1.0 (ODbL):
https://opendatacommons.org/licenses/odbl/1-0/

The SVGs are produced works from that data. Preserve a readable, linked OpenStreetMap attribution wherever the map is displayed. The locally exported SVG includes attribution; the React viewport additionally shows persistent attribution during zoom/pan. Do not remove it when restyling the map.

This package supplies the derived data as roads.geojson, the source OSM way IDs and selected source name tags, the source timestamp in tehran-map-data.json, and the extraction/build scripts. No POI database is included.

Transformations: selection of major, secondary, tertiary, residential, living-street, unclassified and connecting road classes within the documented bounding box, name:fa/name selection, Web Mercator projection, coordinate rounding for SVG, road styling and selection/collision avoidance of street labels. The GeoJSON retains the original coordinates of selected source ways, which may extend outside the queried bounding box. The displayed SVG is clipped to the documented bounds.

Sample gym markers are synthetic demonstration data, not OpenStreetMap gym features, not verified venues, and not endorsements or actual Fitnet partners.
