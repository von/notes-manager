# Notes Manager Google Doc Add-on

Notes Manager is an add-on for Google docs. It goal is to support a workflow in which you have one document that has the latest notes for a recurring meeting and those notes get moved to an archive document after each meeting and replaced with a template for the next meeting. This lets all meeting participants find the current meeting notes in a document which doesn't change and stays a manageable size, and the archive in a well defined place.

Version: 0.2
Homepage: https://github.com/von/notes-manager
License: https://creativecommons.org/licenses/by/4.0/

# Create your Archive and Template Documents

1. Create an archive document. This Google doc will have archive notes prepended to it. It can be blank to start.
2. Create a template document. This Google doc contains whatever text you want and can be inserted to start a new session of taking notes. It can be a blank document.

# Creating Notes Document and Installing Notes Manager

Note Manager isn't currently distributed through official channels, so installation is a manual process as follows:

1. Create a Google doc which will be the one you take notes in.
1. From within your notes document, select the menu item `Tools > Script editor`. If you are presented with a welcome screen, click Blank Project.
1. Delete any code in the script editor and paste in note-manaeger.gs
1. Select the menu item `File > Save all`. Name your new script "Note Manager" and click OK.

Notes manager uses two concepts to manage the notes file:
* A preamble, that is a hunk of text up to the firt horizontal line in the file. Notes Manager will not modify this text. You can use it to put static information about your meeting.
* You will also put links to your archive and template in the preamble. Hyperlinked text in the preamble is used by Notes Manager to find the archive and template for the notes file.

Finish creating your Notes document as follows:

1. Create a preamble by inserting a horizontal line (`Insert > Horizontal line`). Everything above this horizontal line is conidered the "preamble" and will be preserved by Notes Manager.
1. Configure the location to the archive file. Somewhere in the preamble type the text "Notes Archive" (exactly) and make it a hyperlink to the archive document - copy and paste the URL from archive document, select the text "Notes Archive", select `Insert > Link`, paste the archive URL in the "Link" field and select Apply.
1. Configure the location to the template file. Somewhere in the preamble type the text "Notes Template" (exactly) and make it a hyperlink to the archive document - copy and paste the URL from template document, select the text "Notes Template", select `Insert > Link`, paste the templat URL in the "Link" field and select Apply.
1. You can add whatever other text to the preamble you like.

# Using Note Manager

1. Open your Notes Document.
1. Insert your template by selecting `Add-ons > Notes Manager > Insert Template`
1. Type your notes.
1. When you are done taking notes, have Notes Manager move them to the archive by selecting `Add-ons > Notes Manager > Archive`

# Archive Document Preamble

The Archive Document can also have a preamble (any text followed by a horizontal line at the top of the document). Any archived notes will be placed after the preamble.
