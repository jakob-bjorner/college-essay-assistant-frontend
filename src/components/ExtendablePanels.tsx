import { useEffect } from "react";

export default function ExtendablePanels({
  panel_one,
  panel_two,
  unique_panel_id,
  panel_one_width,
  panel_one_min_width = 100,
  panel_two_min_width = 100,
}: {
  panel_one: JSX.Element;
  panel_two: JSX.Element;
  unique_panel_id: string;
  panel_one_width: number;
  panel_one_min_width?: number;
  panel_two_min_width?: number;
}) {
  useEffect(() => {
    let m_pos: number;
    const drag = document.getElementById(unique_panel_id + "-drag");
    const right_panel = document.getElementById(
      unique_panel_id + "-right-panel",
    );
    const left_panel = document.getElementById(unique_panel_id + "-left-panel");
    const container = document.getElementById(unique_panel_id + "-container");
    function resize(e: MouseEvent) {
      if (!container || !right_panel || !left_panel) return;
      const dx = m_pos - e.x;
      m_pos = e.x;
      // ensure the drag bar is within the container
      const left_panel_new_width =
        parseInt(getComputedStyle(left_panel, "").width) - dx;
      const right_panel_new_width =
        parseInt(getComputedStyle(right_panel, "").width) + dx;
      if (
        left_panel_new_width < panel_one_min_width ||
        right_panel_new_width < panel_two_min_width
      )
        return;

      left_panel.style.setProperty("width", left_panel_new_width + "px");
      right_panel.style.setProperty("width", right_panel_new_width + "px");
    }

    drag?.addEventListener(
      "mousedown",
      function (e) {
        m_pos = e.x;
        document.addEventListener("mousemove", resize, false);
      },
      false,
    );
    document.addEventListener(
      "mouseup",
      function () {
        document.removeEventListener("mousemove", resize, false);
      },
      false,
    );
  }, [panel_one_min_width, panel_two_min_width, unique_panel_id]);

  return (
    <div className="flex flex-row w-full" id={unique_panel_id + "-container"}>
      <div id={unique_panel_id + "-left-panel"} className="w-full">
        {panel_one}
      </div>
      <div
        id={unique_panel_id + "-right-panel"}
        className="flex flex-row w-full"
      >
        <div
          id={unique_panel_id + "-drag"}
          className="bg-black-white"
          style={{
            cursor: "col-resize",
            height: "100%",
            left: panel_one_width,
            width: "7px",
            zIndex: 9,
          }}
        ></div>
        <div className="w-full" style={{ zIndex: 8 }}>
          {panel_two}
        </div>
      </div>
    </div>
  );
}
