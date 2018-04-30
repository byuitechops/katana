# Katana

Because a bunch of figurative butter knives weren't good enough for the development team.

## Overview

The intention of Katana is simply to allow safe mass-maintenance of a large number (or small number!) or Canvas courses. To provide an example, the tool will provide functionality to "find and replace" a variety of things. If a link that is commonly used in courses breaks, it could be replaced across any number of courses using Katana. With a variety of various tools, many tedious fixes and audits can be performed through this tool instead.

## How it do

Katana uses the **Canvas SDK**, another NodeJS package written by Brigham Young University - Idaho, that allows ease of API manipulation in Canvas. It is centered around "categories," or the different pieces of a course. Pages, Discussion Topics, and Quizzes are a few of them. They are listed below. The **Fix Tools**, or the various tools available in Katana, are built around these categories. Pages will have different tools than Quizzes, and the like. Tools will be available that affect multiple or all categories.

## What it do

Each fix tool performs a different change to the selected courses. Every change made can be (and should be) reviewed by the user before confirming that they should be implemented. Post-user approval, the change is implemented in each of the selected courses. To give an example:

1. John needs to fix a spelling error that has happened on a page that is copied into every course. The spelling error is only in the current semester's courses.
2. John opens Katana and selects all of the current semester's courses.
3. John selects the "Pages" category, and then selects the "Text Find and Replace" tool.
4. John enters in the incorrectly spelled word, and the correctly spelled version into the provided categories.
5. Each change is previewed to John, and asks for his approval. He gives his approval or denies each change as they are shown to him.
6. Once all have been approved or denied, John submits the fixes. All changes are made within the next couple minutes.

## Fix Tools

Here are the currently available Fix Tools and their categories:

|Tool Name|Categories|
|---------|----------|
| Text Find and Replace | Pages |
| Attribute Editor | Universal |