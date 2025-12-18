# Departures Card

![GitHub Release](https://img.shields.io/github/v/release/alex-jung/ha-departures-card)
![GitHub License](https://img.shields.io/github/license/alex-jung/ha-departures-card)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/alex-jung/ha-departures-card)

A card to display departure times provided by [Departures](https://github.com/alex-jung/ha-departures) custom integration.

<p align="center">
  <img width="600" src="assets/image_top.png"/>
</p>

## Installation

#### Manual

1. Download from last release `dist/ha-departures-car.js` file.
2. Activate Home Assistant `advanced mode` (Profile -> Advanced mode)
3. Open `settings -> Dashboards` and click on tree dots in right upper corner
4. Click on `Ressourcen` and then on `Add Ressource` button
5. Add `local/ha-departures-card.js` as JS module
6. Refresh the page

#### HACS (recommended)

1. Add this repository as a custom repository (HACS -> Custom repositories, type "Dashboard")
2. Search for `Departures Card` and install it.
3. Add new card to the dashboard

## Card Properties

| yaml attribute                          | Type     | Required | Default value                                                     |
| --------------------------------------- | -------- | -------- | ----------------------------------------------------------------- |
| type                                    | string   | yes      | `custom:departures-card`                                          |
| [title](#title)                         | string   | no       | Departures                                                        |
| [icon](#icon)                           | string   | no       | mdi:bus-multiple                                                  |
| [showCardHeader](#showCardHeader)       | boolean  | no       | true                                                              |
| [showScrollButtons](#showScrollButtons) | boolean  | no       | true                                                              |
| [scrollBackTimeout](#scrollBackTimeout) | number   | no       | 5                                                                 |
| [departuresToShow](#departuresToShow)   | number   | no       | 5                                                                 |
| [theme](#theme)                         | string   | no       | Basic                                                             |
| [layout](#layout)                       | string   | no       | icon line destination time-diff planned-time estimated-time delay |
| entities                                | entity[] | yes      | -                                                                 |

### "title"

**Default**: Departures

Sets the card's title, e.g., "Plärrer.".
If no title provided, the default value is used (based on user language setting)

```yaml
type: custom:departures-card
title: Frankenstr.
```

| empty                                   | title: "Plärrer"                |
| --------------------------------------- | ------------------------------- |
| ![card](assets/image_default_title.png) | ![card](assets/image_title.png) |

### "icon"

**Default**: mdi:bus-multiple

Defines the icon displayed on the card.

```yaml
type: custom:departures-card
icon: mdi:bus-multiple
```

| empty                                  | icon: mdi:taxi                         |
| -------------------------------------- | -------------------------------------- |
| ![card](assets/image_default_icon.png) | ![card](assets/image_icon_defined.png) |

### "showCardHeader"

**Default**: true

Defines the card header to show or not.

```yaml
type: custom:departures-card
showCardHeader: true
```

| showCardHeader: true                    | showCardHeader: false                      |
| --------------------------------------- | ------------------------------------------ |
| ![card](assets/image_default_title.png) | ![card](assets/image_showNoCardHeader.png) |

### "showScrollButtons"

**Default**: true

Controls whether scroll buttons are displayed for navigating through the departure list.

When enabled, buttons are shown to allow manual scrolling up and down. When disabled, no scroll buttons are displayed.

The list can always be scrolled by dragging, even when the scroll buttons are hidden.

```yaml
type: custom:departures-card
showScrollButtons: true
```

| showScrollButtons: true                     | showScrollButtons: false                      |
| ------------------------------------------- | --------------------------------------------- |
| ![card](assets/image_showScrollButtons.png) | ![card](assets/image_showNoScrollButtons.png) |

### "scrollBackTimeout"

**Default**: 5 (sec)

Defines the time after which the scrolling list automatically returns to the first position.

If the list has been scrolled, it will reset to the beginning once this timeout expires.

A value of 0 disables the timer and prevents the list from automatically scrolling back.

The value is specified as a duration (in seconds).

```yaml
type: custom:departures-card
scrollBackTimeout: 5
```

| scrollBackTimeout: 1                     | scrollBackTimeout: 5                     |
| ---------------------------------------- | ---------------------------------------- |
| ![card](assets/gif_scrollback_1_sec.gif) | ![card](assets/gif_scrollback_5_sec.gif) |

### "departuresToShow"

**Default**: 5

Specifies how many departures are displayed on a single page.

This value determines the visible height of the card. If more departures are available than can be shown at once, the list becomes scrollable.

```yaml
type: custom:departures-card
departuresToShow: 5
```

| departuresToShow: 3                            | departuresToShow: 10                            |
| ---------------------------------------------- | ----------------------------------------------- |
| ![card](assets/image_departures_to_show_3.png) | ![card](assets/image_departures_to_show_10.png) |

### "theme"

**Default**: Basic

Selects the color theme used to display the departure board.

Different themes define the color scheme for elements such as background, text, icons and delay indicators. This allows the card to be visually adapted to different dashboards or lighting conditions.

```yaml
type: custom:departures-card
theme: basic
```

| theme: Black-White                          | theme: Cappucino                          | theme: Blue Ocean                          |
| ------------------------------------------- | ----------------------------------------- | ------------------------------------------ |
| ![card](assets/image_theme_black-white.png) | ![card](assets/image_theme_cappucino.png) | ![card](assets/image_theme_blue-ocean.png) |

### "layout"

**Default**: "icon line destination time-diff planned-time estimated-time delay"

Defines which cells are shown in each departure row and the order in which they appear.

The layout is specified as a list of cell identifiers. Each identifier represents one column in the departure row. The order of the identifiers determines the left-to-right order of the cells.

Available values:

- `icon` – Transport icon
- `line` – Line or route name
- `destination` – Route destination
- `time-diff` – Time remaining until departure
- `planned-time` – Scheduled departure time
- `estimated-time` – Estimated (real-time) departure time (if provided by API)
- `delay` – Delay compared to the scheduled time

Only the cells listed in layout will be displayed.

```yaml
type: custom:departures-card
layout: icon line destination time-diff delay
```

| layout: icon line destination time-diff delay | layout: line destination planned-time estimated-time |
| --------------------------------------------- | ---------------------------------------------------- |
| ![card](assets/image_layout_0.png)            | ![card](assets/image_layout_1.png)                   |

## Entity Properties

| yaml attribute                      | Type   | Required | Default value |
| ----------------------------------- | ------ | -------- | ------------- |
| [linecolor](#linecolor)             | string | no       | empty         |
| [linename](#linename)               | string | no       | empty         |
| [destinationname](#destinationname) | string | no       | empty         |
| [icon](#icon-1)                     | string | no       | empty         |

### "lineColor"

**Default**: empty (no background color)

The "lineColor" option specifies the background color used to represent a vehicle line on the card. This allows users to visually distinguish different lines by assigning them unique colors. The color can be defined using standard formats like a hex code (e.g., "#D62246") or a predefined color name.

```yaml
type: custom:departures-card
entities:
  - entity: sensor.nurnberg_plarrer_tram_4_gibitzenhof
    lineColor: "#D62246"
```

| empty                                  | lineColor: "#D62246"                        |
| -------------------------------------- | ------------------------------------------- |
| ![card](assets/image_no_linecolor.png) | ![card](assets/image_linecolor_defined.png) |

### "lineName"

**Default**: Name provided by the API.

The "lineName" option specifies the name or identifier of the vehicle line (e.g., bus number, train line, or tram route) displayed on the card.

```yaml
type: custom:departures-card
entities:
  - entity: sensor.nurnberg_plarrer_tram_4_gibitzenhof
    lineName: 4
```

| empty                                       | lineName: 4                                |
| ------------------------------------------- | ------------------------------------------ |
| ![card](assets/image_linecolor_defined.png) | ![card](assets/image_linename_defined.png) |

### "destinationName"

**Default**: Destination name provided by the API.

Option to overwrite default destination name provided by API.

```yaml
type: custom:departures-card
entities:
  - entity: sensor.nurnberg_plarrer_u_bahn_u1_furth_hardhohe
    destinationName: Hardhöhe
```

| empty                                         | destinationName: Hardhöhe                           |
| --------------------------------------------- | --------------------------------------------------- |
| ![card](assets/image_no_destination_name.png) | ![card](assets/image_destination_named_defined.png) |

### "icon"

**Default**: empty

Allows the user to define a custom icon for a specific entity.

If this option is set, the specified icon will be used instead of the default icon provided by API.

```yaml
type: custom:departures-card
entities:
  - entity: sensor.nurnberg_plarrer_u_bahn_u2_rothenbach
    icon: mdi:lamp
```

| empty                                  | icon: mdi:lamp                        |
| -------------------------------------- | ------------------------------------- |
| ![card](assets/image_icon_default.png) | ![card](assets/image_icon_custom.png) |
