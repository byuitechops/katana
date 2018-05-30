# Issues Service

This Angular service provides all the functionality used in managing issues useds by any tool's view and functionality. This is where issue items will be kept and managed while running a tool in the client view.

An issue item object looks like this:

```
{
    // The title of the item in Canvas (i.e. the page name)
    title: <string>,
    // The ID of the course the item belongs to
    course_id: <number>,
    // The ID of the item in Canvas
    item_id: <number>,
    // The type of item in Canvas (i.e. Page)
    Item_type: <string>,
    // URL to the item in Canvas, or a location where it can be conveniently accessed
    link: <string>,
    // The issues contained within the item in Canvas
    issues: [{
      // Less than five words - should describe the issue
      title: <string>,
      // Full description of the issue, written for the user to better understand the issue
      description: <string>,
      // Three possible statuses: ready, skipped, and fixed
      status: <string>
      // The details of an issue will include anything that the view or fixing tool may need
      details: <object>,
    }]
}
```

## Properties
```
issueItems: IssueItem[] 
```
Holds all of the currently selected courses.

```
selectedItem: issueItem
```
What item the user currently has selected.

```
selectedCard: HTMLElement
```
What card representing an issue item the user currently has selected.

## Methods

### setSelectedItem(elementId)

Takes the ID of a single element (a card representing an issue item) and sets `selectedCard` to that element, and `selectedItem` to the respective issue item.
