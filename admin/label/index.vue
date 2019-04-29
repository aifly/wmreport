<template>
  <div class="wm-label-ui lt-full">
    <header>标签管理</header>
    <div class="wm-label-main-content">
      <header>
        <ul>
          <li
            @click="toggleClass(labelClass,i)"
            :class="{'active':currentClassId === labelClass.lableclassid}"
            v-for="(labelClass,i) in labelClassList"
            :key="i"
          >
            <canvas class="wm-label-tab-ico1" ref="canvas2" width="30" height="38"></canvas>
            {{labelClass.classrealname}}
            <Icon
              type="ios-create-outline"
              class="wm-label-edit-ico"
              @click.stop="showEditLabelClass(labelClass)"
            />
            <canvas class="wm-label-tab-ico" ref="canvas1" width="30" height="38"></canvas>
          </li>
          <li @click="showAddLabelClassDialog">
            <canvas class="wm-label-tab-ico1" ref="addclass" width="30" height="38"></canvas>
            <Icon type="ios-add-circle"/>增加类别
            <canvas class="wm-label-tab-ico" ref="addclass1" width="30" height="38"></canvas>
          </li>
        </ul>
      </header>
      <div class="wm-lable-list" :style="{height:viewH -260+'px'}">
        <div class="wm-lable-C">
          <Table class="wm-lable-list-table" :data="dataSource" :columns="columns"></Table>
          <div class="wm-label-table-footer" title="添加标签" @click="showAddLableDialog = true">
            <canvas ref="add" width="30" height="30"></canvas>
            <Icon type="md-add"/>
            <canvas class="wm-label-tab-ico1" ref="add1" width="30" height="30"></canvas>
          </div>
        </div>
        <div class="wm-label-page">
          <Page :total="total" v-if="total>pagenum" @on-change="changePageIndex"/>
        </div>
      </div>
    </div>

    <Modal v-model="showAddLabelClassModal" title="添加分类" :loading="true" :transfer="false">
      <div slot="header" class="mw-labelclass-modal-header">{{editClassId>-1?'编辑分类':'添加分类'}}</div>
      <Form :model="labelClassForm" :label-width="80">
        <FormItem label="名称：">
          <Input v-model="labelClassForm.classrealname"/>
        </FormItem>
        <FormItem label="显示名称：" v-if="false">
          <Input v-model="labelClassForm.classviewname"/>
        </FormItem>
        <FormItem label="筛选显示：">
          <Checkbox
            v-model="resource.isChecked"
            v-for="(resource,i) in resourceList"
            :key="i"
          >{{resource.resourcecnname}}</Checkbox>
        </FormItem>
      </Form>

      <div slot="footer" class="wm-labelclass-dialog-footer">
        <Poptip style="color:#000" confirm title="确定要删除此作品吗?" @on-ok="delLableClass">
          <div v-press class="wm-del-ico">
            <span v-if="editClassId>-1">删除分类</span>
          </div>
        </Poptip>
        <div>
          <Button @click="showAddLabelClassModal = false">取消</Button>
          <Button type="primary" @click="LabelClassAction" :loading="loading">确定</Button>
        </div>
      </div>
    </Modal>

    <Modal v-model="showAddLableDialog" :loading="true" :transfer="false" @on-ok="labelAction">
      <div slot="header" class="mw-labelclass-modal-header">{{labelId>-1?'编辑标签':'添加标签'}}</div>
      <Form :model="labelForm" :label-width="100">
        <FormItem label="标签名称：">
          <Input v-model="labelForm.lableviewname"/>
        </FormItem>
        <FormItem label="参数：">
          <Input v-model="labelForm.lablerealname"/>
        </FormItem>
        <FormItem label="是否默认显示：" v-if='false'>
          <Checkbox
            v-model="resource.isview"
            v-for="(resource,i) in defaultResourceList"
            :key="i"
          >{{resource.resourcecnname}}</Checkbox>
        </FormItem>
        <FormItem label="默认勾选：">
          <Checkbox
            v-model="resource.isdefault"
            v-for="(resource,i) in defaultResourceList"
            :key="i"
          >{{resource.resourcecnname}}</Checkbox>
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
      showAddLableDialog: false,
      resourceList: [],
      currentClassId: -1,
      defaultResourceList: [],
      editClassId: -1,
      total: 0,
      labelClassList: [],
      loading: false,
      labelId: -1,
      pagenum: ((window.innerHeight - 350) / 48) | 0,
      pageindex: 1,
      labelClassForm: {
        classrealname: "",
        classviewname: ""
      },
      labelForm: {
        lablerealname: "",
        lableviewname: ""
      },
      columns: [
        {
	  title: "编号",
	  width:80,
          render: (h, params) => {
            return h("div", {}, params.index + 1);
          }
        },
        {
          title: "标签名称",
          key: "lableviewname"
          /*  render: (h, params) => {
            if (typeof params.row.lableviewname === "object") {
              return h(
                params.row.lableviewname.tag,
                {
                  props: {
                    value: params.row.lableviewname.value
                  },
                  on: {
                    "on-blur": event => {
                      this.labelObj.lableviewname.value = event.target.value;
                    }
                  }
                },
                ""
              );
            } else {
              return h("div", {}, params.row.lableviewname);
            }
          } */
        },
        {
          title: "参数",

          key: "lablerealname"
          /* render: (h, params) => {
            if (typeof params.row.lablerealname === "object") {
              return h("div", [
                h(
                  params.row.lablerealname.tag,
                  {
                    style: {
                      width: "78%"
                    },
                    props: {
                      value: params.row.lablerealname.value
                    },
                    on: {
                      "on-blur": event => {
                        this.labelObj.lablerealname.value = event.target.value;
                      }
                    }
                  },
                  ""
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary"
                    },
                    style: {
                      "margin-left": "10px"
                    },
                    on: {
                      click: () => {
                        this.labelAction();
                      }
                    }
                  },
                  "确定"
                )
              ]);
            } else {
              return h("div", {}, params.row.lablerealname);
            }
          } */
        },
        {
          title: "是否显示",
          width: 200,
          render: (h, params) => {
            return h(
              "div",
              params.row.resourceinfo.map(resource => {
                return h(
                  "Checkbox",
                  {
                    props: {
                      value: !!resource.isview,
                      disabled: true //this.labelId !== params.row.lableid && typeof params.row.lableviewname !== "object"
                    },
                    on: {
                      "on-change": e => {
                        resource.isview = e;
                      }
                    }
                  },
                  resource.resourcecnname
                );
              })
            );
          }
        },
        {
          title: "默认勾选",

          key: "isdefault",
          width: 200,
          render: (h, params) => {
            return h(
              "div",
              params.row.resourceinfo.map(resource => {
                return h(
                  "Checkbox",
                  {
                    props: {
                      value: !!resource.isdefault,
                      disabled: true //this.labelId !== params.row.lableid && typeof params.row.lableviewname !== "object"
                    },
                    on: {
                      "on-change": e => {
                        resource.isdefault = e;
                      }
                    }
                  },
                  resource.resourcecnname
                );
              })
            );
          }
        },
        {
          title: "操作",
          key: "",
          width: 130,
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
                      this.labelId = params.row.lableid;
                      this.labelForm = params.row;

                      this.defaultResourceList = params.row.resourceinfo.slice(
                        0
                      );
                      this.defaultResourceList.forEach(item => {
                        item.isdefault = !!item.isdefault;
                        item.isview = !!item.isview;
                      });
                      this.showAddLableDialog = true;
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
                      this.delLable(params.row.lableid);
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
                          //
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
      dataSource: []
    };
  },
  components: {},
  watch: {
    showAddLabelClassModal(val) {
      if (!val) {
        this.resourceList.forEach(re => {
          re.isChecked = false;
        });
        this.resourceList = this.resourceList.concat([]);
        this.editClassId = -1;
        this.labelClassForm = {};
      }
    },
    showAddLableDialog(val) {
      if (!val) {
        this.defaultResourceList.map(re => {
          re.isview = false;
          re.isdefault = false;
        });
        this.labelForm = {};
        this.labelId = -1;
        this.getLableByLabelClass(s.currentClassId);
      }
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
	this.resourceList = dataList;
        this.defaultResourceList = dataList.concat([]);
        console.log(dataList, "dataList");
      }
    }, 30);

    window.s = this;

    this.getLabelClassList();
    this.initTabIco(-1, "addclass");
    this.initTabIco(-1, "addclass1");

    this.initTabIco(-1, "add", "#f90");
    this.initTabIco(-1, "add1", "#f90");
  },
  methods: {
    changePageIndex(e) {
      this.pageindex = e;
      this.getLableByLabelClass(this.currentClassId);
    },

    delLable(lableid) {
      //删除标签

      var s = this;
      symbinUtil.ajax({
        url: window.config.baseUrl + "/wmadadmin/dellable/",
        data: {
          lableids: lableid
        },
        success(data) {
          if (data.getret === 0) {
            s.$Message.success(data.getmsg);
            s.getLableByLabelClass(s.currentClassId);
          }
        }
      });
    },
    showEditLabelClass(labelClass) {
      this.editClassId = labelClass.lableclassid;

      this.labelClassForm = labelClass;
      this.showAddLabelClassModal = true;
      labelClass.resourceinfo.map((re, i) => {
        this.resourceList.map((res, k) => {
          if (re.resourceid === res.resourceid) {
            res.isChecked = !!re.isview;
          }
        });
      });
    },
    addLable() {
      //添加标签
      //this.dataSource.push(this.labelObj);
    },
    labelAction() {
      var s = this;
      var sourcelist = {};
      this.defaultResourceList.map(re => {
        sourcelist[re.resourceid] = sourcelist[re.resourceid] || {}; //!!re.isChecked * 1
        sourcelist[re.resourceid].isdefault = !!re.isdefault * 1;
        sourcelist[re.resourceid].isview = 1;// !!re.isview * 1;
      });
      var url = window.config.baseUrl + "/wmadadmin/addlable/";
      if (this.labelId > -1) {
        url = window.config.baseUrl + "/wmadadmin/editlable/";
      }

      symbinUtil.ajax({
        url,
        data: {
          lableid: s.labelId,
          lableclassid: s.currentClassId,
          lableviewname: s.labelForm.lableviewname,
          lablerealname: s.labelForm.lablerealname,
          resourcelist: JSON.stringify(sourcelist)
        },
        success(data) {
          if (data.getret === 0) {
            s.showAddLableDialog = false;
            s.$Message.success(data.getmsg);
            s.getLableByLabelClass(s.currentClassId);
          } else {
            s.showAddLableDialog = false;
            s.$Message.error(data.getmsg);
          }
        }
      });
    },
    showAddLabelClassDialog() {
      this.showAddLabelClassModal = true;
    },

    delLableClass() {
      //删除分类
      var s = this;
      var url = window.config.baseUrl + "/wmadadmin/dellableclass/";
      s.loading = true;
      symbinUtil.ajax({
        url,
        data: {
          lableclassids: s.editClassId
        },
        success(data) {
          s.showAddLabelClassModal = false;
          s.loading = false;
          if (data.getret === 0) {
            s.$Message.success(data.getmsg);
            s.getLabelClassList();
          } else {
            s.$Message.error(data.getmsg);
          }
        }
      });
    },

    LabelClassAction() {
      //添加分类
      var s = this;
      var sourcelist = {};
      this.resourceList.map(re => {
        sourcelist[re.resourceid] = !!re.isChecked * 1;
      });
      var url = window.config.baseUrl + "/wmadadmin/addlableclass/";
      if (this.editClassId > -1) {
        url = window.config.baseUrl + "/wmadadmin/editlableclass/";
      }
      s.loading = true;
      console.log(sourcelist);
      symbinUtil.ajax({
        url,
        data: {
          lableclassid: s.editClassId,
          classrealname: s.labelClassForm.classrealname,
          classviewname: s.labelClassForm.classviewname,
          resourcelist: JSON.stringify(sourcelist)
        },
        success(data) {
          if (data.getret === 0) {
            s.$Message.success(data.getmsg);
            s.getLabelClassList();
          } else {
            s.$Message.error(data.getmsg);
          }
          s.loading = false;
          s.showAddLabelClassModal = false;
        }
      });
    },

    getLableByLabelClass(classid) {
      var s = this;
      symbinUtil.ajax({
        url: window.config.baseUrl + "/wmadadmin/getlablebyclass/",
        data: {
          page: s.pageindex,
          pagenum: s.pagenum,
          lableclassid: classid
        },
        success(data) {
          if (data.getret === 0) {
			//s.refreshTabIco();
            if (data.list.length) {
				if(data.list.filter(item => {
                return item.lableclassid === classid;
              })[0]){
				  s.dataSource = data.list.filter(item => {
					return item.lableclassid === classid;
				  })[0].lable;
			  }
            } else {
              s.dataSource = [];
            }
            s.total = data.totalnum;
          }
        }
      });
    },

    refreshTabIco() {
      setTimeout(() => {
        this.labelClassList.map((item, i) => {
          this.initTabIco(i);
          this.initTabIco(i, "canvas2");
        });
      }, 10);
    },

    getLabelClassList() {
      var s = this;
      symbinUtil.ajax({
        url: window.config.baseUrl + "/wmadadmin/getlableclass",
        data: {
          status: 1
        },
        success(data) {
          if (data.getret === 0) {
            s.labelClassList = data.list;
            if (s.labelClassList.length) {
			  s.currentClassId = s.labelClassList[0].lableclassid;
			  s.toggleClass(s.labelClassList[0],0);
            }
            s.refreshTabIco();
          }
        }
      });
    },

    toggleClass(labelClass, index) {
      this.currentClassId = labelClass.lableclassid;
      this.refreshTabIco();
      this.pageindex = 1;
      this.getLableByLabelClass(this.currentClassId);

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
 