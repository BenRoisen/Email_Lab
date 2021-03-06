class Email
{
    constructor(img,thumb,menuX,menuY,menuW,menuH,zoomX,zoomY,zoomW,zoomH,name)
    {
        //what email image to use as its sprite & thumbnail
        this.image = img;
        this.thumbnail = thumb;

        //dimension & position of the email in menu view
        this.menuPos = {x: menuX, y: menuY}; //refers to top left corner
        this.menuScale = {width: menuW, height: menuH}; //assume the dimensions passed to the constructor refer to our menu size
        //dimension & position of the email in zoom view
        this.zoomPos = {x: zoomX, y: zoomY};
        this.zoomScale = {width: zoomW, height: zoomH};
        //position to return to in case (for whatever reason) a drag fails & we need to return to where we were @ drag start
        this.returnPos = {x: menuX, y: menuY};

        //state tracking
        this.zoomMode = false; //controls whether we're zoomed in or out
        this.dragging = false; //whether we're being dragged
        //used to maintain the same position relative to the initial mouse click when dragging
        this.dragOffset = {x: 0, y: 0};
        this.name = name;
    }

    //renders the email
    draw()
    {
        if (this.zoomMode)
        {
            //draw zoomed in (readable) form
            image(this.image, this.zoomPos.x, this.zoomPos.y, this.zoomScale.width, this.zoomScale.height);
        }
        else if (this.dragging)
        {
            //draw in menu mode, but following the mouse
            image(this.thumbnail, mouseX - this.dragOffset.x, mouseY - this.dragOffset.y, this.menuScale.width, this.menuScale.height);
        }
        else
        {
            //draw small menu form
            image(this.thumbnail, this.menuPos.x, this.menuPos.y, this.menuScale.width, this.menuScale.height);
        }
    }

    //Figure out if we were clicked on to start a drag, and if so perform drag setup.
    //Assumes that it was called in mousePressed(), so it knows *a* click occurred, but not necessarily on it.
    //Returns true if the email should be dragged, false if it shouldn't.
    beginDrag()
    {
        //Axis-Aligned Bounding Box collision detection.
        //We can assume that drags can only ever start when we're locked
        //in a menu slot, so we'll be at the position in menuPos.
        if ((mouseX >= this.menuPos.x)
            && (mouseX <= this.menuPos.x + this.menuScale.width)
            && (mouseY >= this.menuPos.y)
            && (mouseY <= this.menuPos.y + this.menuScale.height))
        {
            //mouse hit us - begin drag
            this.dragging = true;
            //save the offset to the current mouse position so we can maintain
            //our relative position to the cursor as we're dragged around
            this.dragOffset.x = mouseX - this.menuPos.x;
            this.dragOffset.y = mouseY - this.menuPos.y;
            //indicate drag began sucessfullly
            return true;
        }
        else //mouse missed us
        {
            return false;
        }
    }

    //Return to the menu state once drag ends.
    //Args: the (x,y) position to snap to.
    //If no position is specified, returns to its original post
    endDrag(x,y)
    {
        this.dragging = false;
        if (arguments.length < 2)
        {
            console.log("Snapping back to start");
            this.menuPos.x = this.returnPos.x;
            this.menuPos.y = this.returnPos.y;
        }
        else
        {
            this.menuPos.x = x;
            this.menuPos.y = y;
        }
    }

    //helper method to set the object's menu position.
    //Args: (x,y) = coords to set the menu to; doReturnPos = whether to also override returnPos with the new coords (boolean)
    setMenuPosition(x,y,doReturnPos)
    {
        this.menuPos.x = x;
        this.menuPos.y = y;
        
        if(doReturnPos)
        {
            this.returnPos.x = x;
            this.returnPos.y = y;
        }
    }
}