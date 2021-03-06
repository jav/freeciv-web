/********************************************************************** 
 Freeciv - Copyright (C) 2009 - Andreas Røsdal   andrearo@pvv.ntnu.no
   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2, or (at your option)
   any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
***********************************************************************/


/****************************************************************************
  Triggered when the mouse button is clicked UP on the mapview canvas.
****************************************************************************/
function mapview_mouse_click(e)
{
  var rightclick = false;
  var middleclick = false;

  if (!e) var e = window.event;
  if (e.which) {
    rightclick = (e.which == 3);
    middleclick = (e.which == 2);
  } else if (e.button) {
    rightclick = (e.button == 2);
    middleclick = (e.button == 1 || e.button == 4);
  }
  
  if (!rightclick && !middleclick) {
    /* Left mouse button*/
    action_button_pressed(mouse_x, mouse_y, SELECT_POPUP);
  } 

  deactivate_goto();
}

/****************************************************************************
  Triggered when the mouse button is clicked DOWN on the mapview canvas.
****************************************************************************/
function mapview_mouse_down(e)
{
  var rightclick = false;
  var middleclick = false;

  if (!e) var e = window.event;
  if (e.which) {
    rightclick = (e.which == 3);
    middleclick = (e.which == 2);
  } else if (e.button) {
    rightclick = (e.button == 2);
    middleclick = (e.button == 1 || e.button == 4);
  }

  if (!rightclick && !middleclick) {
    /* Left mouse button is down */
    if (goto_active) return;

    setTimeout("check_mouse_drag_unit(" + mouse_x + "," + mouse_y + ");", 100);
  } else if (middleclick) {
    popit(); 
  } else {
    release_right_button(mouse_x, mouse_y);
  }

}


/****************************************************************************
  This function is triggered when the mouse is clicked on the city canvas.
****************************************************************************/
function city_mapview_mouse_click(e)
{
  var rightclick;
  if (!e) var e = window.event;
  if (e.which) {
    rightclick = (e.which == 3);
  } else if (e.button) {
    rightclick = (e.button == 2);
  }
  
  if (!rightclick) {
    city_action_button_pressed(mouse_x, mouse_y);
  }


}

/****************************************************************************
...
****************************************************************************/
function check_mouse_drag_unit(canvas_x, canvas_y)
{
  var ptile = canvas_pos_to_tile(canvas_x, canvas_y);
  if (ptile == null) return;

  var sunit = find_visible_unit(ptile);

  if (sunit != null) {
    if (sunit['owner'] == client.conn.playing.playerno) {
      set_unit_focus_and_redraw(sunit);
      activate_goto();
    }
  }

  var ptile_units = tile_units(ptile);
  if (ptile_units.length > 1) {
     update_select_unit_dialog(ptile_units);
  }



}

/**************************************************************************
  Do some appropriate action when the "main" mouse button (usually
  left-click) is pressed.  For more sophisticated user control use (or
  write) a different xxx_button_pressed function.
**************************************************************************/
function action_button_pressed(canvas_x, canvas_y, qtype)
{
  var ptile = canvas_pos_to_tile(canvas_x, canvas_y);

  if (can_client_change_view() && ptile != null) {
    /* FIXME: Some actions here will need to check can_client_issue_orders.
     * But all we can check is the lowest common requirement. */
    do_map_click(ptile, qtype);
  }
}


/**************************************************************************
  Do some appropriate action when the "main" mouse button (usually
  left-click) is pressed.  For more sophisticated user control use (or
  write) a different xxx_button_pressed function.
**************************************************************************/
function city_action_button_pressed(canvas_x, canvas_y)
{
  var ptile = canvas_pos_to_tile(canvas_x, canvas_y);

  if (can_client_change_view() && ptile != null) {
    /* FIXME: Some actions here will need to check can_client_issue_orders.
     * But all we can check is the lowest common requirement. */
    do_city_map_click(ptile);
  }
}

/**************************************************************************
 Action depends on whether the mouse pointer moved
 a tile between press and release.
**************************************************************************/
function release_right_button(mouse_x, mouse_y)
{
  recenter_button_pressed(mouse_x, mouse_y);
}


/**************************************************************************
  Recenter the map on the canvas location, on user request.  Usually this
  is done with a right-click.
**************************************************************************/
function recenter_button_pressed(canvas_x, canvas_y)
{
  var ptile = canvas_pos_to_tile(canvas_x, canvas_y);

  if (can_client_change_view() && ptile != null) {
    /* FIXME: Some actions here will need to check can_client_issue_orders.
     * But all we can check is the lowest common requirement. */
    enable_mapview_slide(ptile);
    center_tile_mapcanvas(ptile);
  }
}

/**************************************************************************
...
**************************************************************************/
function popit()
{
  var ptile = canvas_pos_to_tile(mouse_x, mouse_y);
  if (ptile == null) return;
  
  var punit_id = 0;
  var punit = find_visible_unit(ptile);
  if (punit != null) punit_id = punit['id'];

  var packet = {"type" : packet_info_text_req, "visible_unit" : punit_id,
                "x" : ptile['x'], "y" : ptile['y']};
  send_request (JSON.stringify(packet));


}

/**************************************************************************
...
**************************************************************************/
function handle_info_text_message(packet)
{
  var message = unescape(packet['message']);
  var regxp = /\n/gi;
  message = message.replace(regxp, "<br>\n");

  show_dialog_message("Tile Information", message);

}
