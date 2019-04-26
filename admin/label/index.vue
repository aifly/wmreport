<template>
  <div class="wm-label-ui lt-full">
    <header>标签管理</header>
    <div class="wm-label-main-content">
      <header>
        <ul>
          <li
            @click="toggleClass(labelClass,i)"
            :class="{'active':currentClassIndex === i}"
            v-for="(labelClass,i) in labelClassList"
            :key="i"
          >
            <canvas class="wm-label-tab-ico1" ref="canvas2" width="30" height="38"></canvas>
            {{labelClass.classrealname}}
            <Icon type="ios-create-outline" class="wm-label-edit-ico"/>
            <canvas class="wm-label-tab-ico" ref="canvas1" width="30" height="38"></canvas>
          </li>
          <li @click="showAddLabelClassDialog">
            <canvas class="wm-label-tab-ico1" ref="addclass" width="30" height="38"></canvas>
            <Icon type="ios-add-circle"/>增加类别
            <canvas class="wm-label-tab-ico" ref="addclass1" width="30" height="38"></canvas>
          </li>
        </ul>
      </header>
      <div class="wm-lable-list">
        <div class="wm-lable-C">
          <Table class="wm-lable-list-table" :data="dataSource" :columns="columns"></Table>
          <div class="wm-label-table-footer" title="添加标签" @click='addLable'>
            <canvas ref="add" width="30" height="30"></canvas>
            <Icon type="md-add"/>
            <canvas class="wm-label-tab-ico1" ref="add1" width="30" height="30"></canvas>
          </div>
        </div>
      </div>
    </div>

    <Modal v-model="showAddLabelClassModal" title="添加分类">
      <div slot="header" class="mw-labelclass-modal-header">添加分类</div>
      <Form :model="labelClassForm" :label-width="80">
        <FormItem label="名称">
          <Input/>
        </FormItem>
        <FormItem label="筛选显示">
          <Checkbox v-for="(resource,i) in resourceList" :key="i">{{resource.resourcecnname}}</Checkbox>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import "./index.css";
import symbinUtil from "../lib/util";
import Vue from "vue";

export default {
  props: ["obserable"],
  name: "zmitiindex",
  data() {
    return {
      imgs: window.imgs,
      viewH: document.documentElement.clientHeight,
      showAddLabelClassModal: false,
      resourceList: [],
      currentClassIndex: -1,
      labelClassList: [],
      labelClassForm: {},
      columns: [
        {
          title: "标签名称",
          key: "lableviewname",
          render: (h, params) => {
            if (typeof params.row.lableviewname === "object") {
              return h(
                params.row.lableviewname.tag,
                {
                  props: {
                    value: params.row.lableviewname.value
                  },
                  on: {
                    "on-blur": event => {
                      params.row.lableviewname.value = event.target.value;
                    }
                  }
                },
                ""
              );
            } else {
              return h("div", {}, params.row.lableviewname);
            }
          }
        },
        {
          title: "参数",
          key: "lablerealname",
          render: (h, params) => {
            if (typeof params.row.lablerealname === "object") {
              return h(
                params.row.lablerealname.tag,
                {
                  props: {
                    value: params.row.lablerealname.value
                  },
                  on: {
                    "on-blur": event => {
                       this.dataSource[2].lablerealname.value = event.target.value;
                    }
                  }
                },
                ""
              );
            } else {
              return h("div", {}, params.row.lablerealname);
            }
          }
        },
        {
          title: "默认勾选",
          key: "isview",
          render: (h, params) => {
            return h(
              "div",
              this.resourceList.map(resource => {
                return h("Checkbox", {}, resource.resourcecnname);
              })
            );
          }
        },
        {
          title: "操作",
          key: "",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    margin: "2px 5px",
                    border: "none",
                    background: "#fab82e",
                    color: "#fff",
                    padding: "3px 7px 2px",
                    fontSize: "12px",
                    borderRadius: "3px"
                  },
                  on: {
                    click: () => {
                      this.currentRateid = params.row.userid;
                      this.formAdmin = params.row;
                      this.visible = true;
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "确定要删除吗"
                  },
                  on: {
                    "on-ok": () => {
                      this.delRater(params.row.raterid);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                      },
                      on: {
                        click: () => {
                          //this.remove(params.index,params.row.employeeid)
                        }
                      }
                    },
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ],
      dataSource: [
        {
          lableviewname: "2018",
          lablerealname: "2018"
        },
        {
          lablerealname: "2019",
          lableviewname: "2019"
        },
        {
          lablerealname: {
			tag: "Input",
			value:''
          },
          lableviewname: {
			tag: "Input",
			value:''
          }
        }
      ]
    };
  },
  components: {},
  watch: {
    lablerealname(val) {
      console.log(1111111);
    }
  },
  mounted() {
    var t = setInterval(() => {
      var dataList = Vue.obserable.trigger({
        type: "getResourceList"
      });

      if (dataList) {
        clearInterval(t);
        var arr = [];
        /* for(var i = 0 ; i<10;i++){
						arr = arr.concat(dataList);
					} */
        this.resourceList = dataList;
        console.log(dataList);
      }
    }, 30);

    this.getLabelClassList();
    this.initTabIco(-1, "addclass");
    this.initTabIco(-1, "addclass1");

    this.initTabIco(-1, "add", "#f90");
    this.initTabIco(-1, "add1", "#f90");
  },
  methods: {

	addLable(){//添加标签 
		alert(this.dataSource[2].lablerealname.value+ ' -- ' +this.dataSource[2].lableviewname.value)
	},
    showAddLabelClassDialog() {
      this.showAddLabelClassModal = true;
    },

    refreshTabIco() {
      setTimeout(() => {
        this.labelClassList.map((item, i) => {
          this.initTabIco(i);
          this.initTabIco(i, "canvas2");
        });
      }, 100);
    },

    getLabelClassList() {
      var s = this;
      symbinUtil.ajax({
        url: window.config.baseUrl + "/wmadadmin/getlableclass",
        data: {
          status: 1
        },
        success(data) {
          console.log(data);
          if (data.getret === 0) {
            s.labelClassList = data.list;
            s.refreshTabIco();
          }
        }
      });
    },

    toggleClass(labelClass, index) {
      this.currentClassIndex = index;
      this.refreshTabIco();

      setTimeout(() => {
        this.initTabIco(index, "canvas1", "#fff");
        this.initTabIco(index, "canvas2", "#fff");
      }, 101);
    },

    initTabIco(index, ref = "canvas1", color = "#f7f7f7") {
      if (index !== -1) {
        var canvas = this.$refs[ref][index];
      } else {
        var canvas = this.$refs[ref];
      }
      var context = canvas.getContext("2d");
      var width = canvas.width,
        height = canvas.height;
      context.beginPath();
      context.fillStyle = color;
      context.moveTo(0, 0);
      context.bezierCurveTo(
        (width / 3) * 2,
        height / 4,
        width / 4,
        (height / 3) * 2,
        width,
        height
      );
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();
      context.fill();
    }
  }
};
</script>
 <style>
</style>
 