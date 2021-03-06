 <div>
    <%-- The main mapview canvas --%>  
    <div id="canvas_div">
      <canvas id="canvas" width="1024" height="768" moz-opaque="true"></canvas>
    </div>
    
     <%-- Message chatbox --%>
     <div id="game_chatbox_panel">
	<div id="game_message_area"></div>
	<div id="game_chat_box">
		<input id="game_text_input" type="text" name="text_input" />
	</div>
     </div>

    <%-- Game status panel --%>
    <div id="game_status_panel"></div>

    <%-- Orders icons. --%>
    <jsp:include page="orders.jsp" flush="false"/>


    <%-- Overview mini-map --%>
    <div id="game_overview_panel">
	<div id="game_overview_map">
       		<div id="map_click_div">
	     		<img id="overview_map"/>   
        	</div>
	</div>
    </div>


    <%-- Unit orders and info panel --%>
    <div id="game_unit_panel">
	<div id="game_action_panel">&nbsp;
		<div id="game_unit_info">&nbsp;
		</div>
	</div>   
    </div>


  </div>
